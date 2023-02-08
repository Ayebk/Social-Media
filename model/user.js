const express = require('express');
const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type:String,
        max:50,
        required: true,
        unique: true,
        match: /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/
    },
    username: {
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    followers:{
        type:Array,
        default:[]
    }, 
    followings:{
        type:Array,
        default:[]
    },
    img:{type:String},
    resetToken:String,
    expireToken:Date,
})
module.exports = mongoose.model('User', userSchema);

