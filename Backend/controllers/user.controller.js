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

    res.status(200).json({ token, user })



}

