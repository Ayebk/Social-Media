const express = require('express');
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
         ref:'User'
      },
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true,
        maxLength:500
    },
    content:{
        type:String
    },
    categoryId:{
       type:mongoose.Schema.Types.ObjectId, ref:'Category' //ref = which module we talking about
    },
    likes: {  type: Array,
              default: [],}
    ,
    comments:[{
        text: String,
        username: String,
        userId:String,
        img:String
        
        }]
    , 
    img:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2021/08/24/15/38/sand-6570980_960_720.jpg'

    },
    vid:{
        type:String,
    },
    
},{ timestamps: true })



module.exports = mongoose.model('Post', postSchema);
