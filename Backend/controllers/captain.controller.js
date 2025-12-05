const captainModels = require('../models/captain.model');
const {validationResult} = require('express-validator');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');

// for register captain
module.exports.registerCaptain = async (req, res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // const { fullname, email, password, color, plate, capacity, vehicleType } = req.body;
    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModels.findOne({ email });
    if(isCaptainAlreadyExist){
        return res.status(400).json({message: 'Captain is already registered'});
    }

    
    const hashedPassword = await captainModels.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashedPassword,
        color : vehicle.color,
        plate : vehicle.plate,
        capacity : vehicle.capacity,
        vehicleType : vehicle.vehicleType,

    })
    
    const token = captain.generateAuthToken();
    res.status(201).json({ token, captain });

}

// for login captain
module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const { email, password } = req.body;

    const captain = await captainModels.findOne({email}).select('+password');
    if(!captain){
        return res.status(400).json({message: 'Invalid email and password'});
    }

    const isPasswordMatched = await captain.comparePassword(password);
    if(!isPasswordMatched){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({token, captain})
}

// for profile captain
module.exports.profileCaption = async (req, res, next) => {
    res.status(200).json(req.captain);
}

// for logout captain
module.exports.logoutCaption = async(req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({message: 'Logged out Successfully'});


}
