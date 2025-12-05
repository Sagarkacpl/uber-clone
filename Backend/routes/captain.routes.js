const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller')
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/register',[
    body('fullname.firstname').isLength({min : 6}).withMessage('First name must be at least 6 characters'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
    body('vehicle.color').isLength({min: 3}).withMessage('Color must be at least 3 characters'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Vehicle Number Plate must be at least 3 characters'),
    body('vehicle.capacity').isInt({min: 2}).withMessage('Capacity must be at least 2 characters'),
    body('vehicle.vehicleType').isIn(['car','motercycle','auto']).withMessage('Invalid Vehicle Type')
],
    captainController.registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
],
    captainController.loginCaptain
)

router.get('/profile', authMiddleware.authCaptain, captainController.profileCaption);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaption);


module.exports = router;


