module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to access this page');
        return res.redirect('/login');
    }
    // Check if user session is still valid
    if (!req.user || !req.user._id) {
        req.logout(function(err) {
            if (err) { return next(err); }
            req.flash('error', 'Your session has expired. Please log in again.');
            res.redirect('/login');
        });
        return;
    }
    next();
}; 