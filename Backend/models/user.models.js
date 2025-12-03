const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname:{firstname:{type: String, required: true, minlength: [6, 'First name must be at least 6 characters']},lastname:{type: String, minlength: [6, 'Last name must be at least 6 characters']}},
    email: {type: String,required : true,unique: true,minlength: [10, 'Email must be at least 10 characters']},
    password: {type: String,required : true,select: false},
    socketId: {type: String}
})

// for generate jwt token
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    return token;
}

// for compare passwords
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

// for genrate hashed password 
userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}


const userModels = mongoose.model('user', userSchema);

module.exports = userModels;
