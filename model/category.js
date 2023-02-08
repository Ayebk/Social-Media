const express = require('express');
const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
        max:200
    },
    img:{type:String},
    
})

module.exports = mongoose.model('Category',categorySchema);