const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware');
const userController = require('../controller/user');


router.get('/signup', userController.renderSignUp);

router.post('/signup', userController.signUp);

router.get('/login',  userController.renderLogin);

router.post('/login',
    saveRedirectUrl, 
    passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}),
    userController.login
);

router.get('/logout', userController.logout);

module.exports = router;