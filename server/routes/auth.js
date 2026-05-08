const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
  (req, res) => {
    const token = jwt.sign(
      { _id: req.user._id, displayName: req.user.displayName, email: req.user.email, photo: req.user.photo },
      process.env.JWT_SECRET || process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);

const protect = require('../middleware/auth');

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

module.exports = router;
