const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const capitanSchema = new mongoose.Schema({
    fullname:{firstname: {type: String,required: true,minlength: [6, 'First name must be at least 6 characters']},lastname: {type:String,minlength: [6, 'Last name must be at least 6 characters']}},

    email:{type: String,required: true,unique: true,minlength: [10, 'Email must be at least 10 characters']},

    password: {type: String,required : true,select: false},
    
    socketId: {type: String},
    status:{type: String,emun: ['active', 'inactive'],default: 'inactive'},

    vehicle: {
  color: {
    type: String,
    required: true,
    minlength: [3, 'Color must be at least 3 characters']
  },
  plate: {
    type: String,
    required: true,
    minlength: [3, 'Vehicle Number Plate must be at least 3 characters']
  },
  capacity: {
    type: Number,
    required: true,
    min: [2, 'Capacity must be at least 2 seats'] // <-- fix
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'motercycle', 'auto']
  }
},


    location:{lat:{type: Number,requried: true,},long:{type: Number,requried: true,}}
})


// for generate jwt token
capitanSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

// for compare passwords
capitanSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

// for genrate hashed password 
capitanSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}


const captainModels = mongoose.model('captain', capitanSchema);

module.exports = captainModels;
