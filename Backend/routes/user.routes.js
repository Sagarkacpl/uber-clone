const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const userController = require('../controllers/user.controller')

// User Register Routes
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 6}).withMessage("First name must be at least 6 characters"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
],
    userController.registerUser 
)

// User Login Routes
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
],
    userController.loginUser
)


module.exports  = router;