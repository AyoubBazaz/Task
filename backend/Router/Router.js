const express = require('express');
const router = new express.Router();
const User = require('../Controller/Auth');

// Use authenticateToken middleware for protected routes
router.get('/members', User.show);
router.get('/member/:id', User.showId);
router.post('/login', User.login);
router.post('/create', User.register);

module.exports = router;
