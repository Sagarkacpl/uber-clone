const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullname:{firstname:{type: String, required: true, minlength: [6, 'First name must be at least 6 characters']},lastname:{type: String, minlength: [6, 'Last name must be at least 6 characters']}},
    email: {type: String,required : true,unique: true,minlength: [10, 'Email must be at least 10 characters']},
    password: {type: String,required : true,select: false},
    socketId: {type: String}
})