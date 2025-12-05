const blackListTokenModel = require('../models/blackListToken.model');
const userModels = require('../models/user.models');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');

// for register logic
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }    

    const { fullname , email, password } = req.body;

    const isUserAlreadyExist = userModels.findOne({email});
    if(isUserAlreadyExist){
        return re.status(400).json({message: 'User is already registered'});
    }

    const hashedPassword = await userModels.hashPassword(password);

    const user = await userService.createUser({
        firstname : fullname.firstname, 
        lastname : fullname.lastname,
        email, 
        password: hashedPassword
    })

    const token = user.generateAuthToken();
    res.status(201).json({ token, user });

}

// for login logic
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModels.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    // res.cookie('token', token, {httpOnly: true,secure: process.env.NODE_ENV === "production",maxAge: 3600000})

    res.cookie('token', token);


    res.status(200).json({ token, user });




}

// for get user profile
module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

// for user logout
module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.clearCookie('token');

    res.status(200).json({message: 'Logged out Successfully'});
    
}

