const userModels = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');


module.exports.authUser = async (req, res, next) => {
    // first we get token from cookies and headers when user loggedin
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    if(!token){
        return res.status(401).json({message: "Unauthorized Access"});
    }

    // check if user logged out and user have already token in local storage
    
    // const isBlacklisted = await userModels.findOne({token: token});
    
    const isBlacklisted = await blackListTokenModel.findOne({token: token});
    if(isBlacklisted){
        return res.status(401).json({message: "Unauthorized Access"});
    }


    try {
        // now here we can decode the token and get the user logged in  _id
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // here we can find the user were above the decode get _id
        const user = await userModels.findById(decode._id);

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({message: "Unauthorized Access"});
    }

}