const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@mnit\.ac\.in$/.test(v);
            },
            message: props => `${props.value} is not a valid MNIT email address!`
        },
        index: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot be more than 30 characters']
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    department: {
        type: String,
        enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'],
        required: [true, 'Department is required']
    },
    year: {
        type: Number,
        min: [1, 'Year must be between 1 and 4'],
        max: [4, 'Year must be between 1 and 4']
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true
});

// Add text index for search
userSchema.index({ username: 'text', email: 'text' });

// Plugin configuration
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    errorMessages: {
        UserExistsError: 'A user with the given email is already registered',
        MissingPasswordError: 'No password was given',
        AttemptTooSoonError: 'Account is currently locked. Try again later',
        TooManyAttemptsError: 'Account locked due to too many failed login attempts',
        NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
        IncorrectPasswordError: 'Password or email is incorrect',
        IncorrectUsernameError: 'Password or email is incorrect',
        MissingUsernameError: 'No email was given',
        UserExistsError: 'A user with the given email is already registered'
    }
});

// Pre-save middleware to update lastLogin
userSchema.pre('save', function(next) {
    if (this.isModified('lastLogin')) {
        this.lastLogin = Date.now();
    }
    next();
});

module.exports = mongoose.model('User', userSchema); 