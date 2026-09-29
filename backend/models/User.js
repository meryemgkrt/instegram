const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        default: ''
    },
    userName:{
        type: String,
        unique: true,
        required: true,
        min:5,
        max:20
    },
    email:{
        type: String,
        unique: true,
        required: true,
        max:50
    },
    password:{
        type: String,
        required: true,
        min:6,
        max:20,
    
    }, 
    bio:{
        type: String,
        default: '',
        max:100
    },
    profilePicture:{
        type: String,
        default: ''
    },
    followers:{
        type: Array,
        default: []
    },
    followings:{
        type: Array,
        default: []
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);