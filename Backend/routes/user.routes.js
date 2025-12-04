const express = require('express');
const router = express.Router();
const {body} = require('express-validator')

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 6}).withMessage("First name must be at least 6 characters"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
    
])


module.export = router;