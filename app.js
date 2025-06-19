// Default layout
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const User = require('./models/User');
const authRoutes = require('./routes/auth'); // ✅ Add this line to include your auth routes
const marketplaceRoutes = require('./routes/marketplace');
const libraryRoutes = require('./routes/library');
const freshersGuideRoutes = require('./routes/freshersguide');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://code.jquery.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
        },
    },
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
// app.use(limiter); // Disabled for development. Re-enable in production if needed.

app.set('layout', 'layouts/boilerplate');

// Connect to MongoDB with improved options
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mnit-marketplace', {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Session configuration - using a single session middleware
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'Groot-i-miss-you',
    name: 'sessionId', // Don't use default connect.sid
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(flash());
app.use(expressLayouts);
app.use(methodOverride('_method'));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', authRoutes); // ✅ Connect the auth routes here
app.use('/marketplace', marketplaceRoutes);
app.use('/library', libraryRoutes);
app.use('/freshersguide', freshersGuideRoutes);

// Temporary Home Page (create this file)
app.get('/', (req, res) => {
    res.render('home');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { err: { message: 'Page not found' } });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
