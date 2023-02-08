const User = require('../model/user');
const Post = require('../model/post');
const Category = require('../model/category');
const mongoose = require('mongoose');


const routs = {

    getAllCategories: (req,res)=>{
        try{
            Category.find().then((category)=>{
             res.status(200).json({
                    message: category
                })
            }) }
            catch (error){
                res.status(500).json({
                    message: error
                })
            }

    


    },
    createCategories: (req,res)=>{

        try{      
              const {title, description ,}= req.body;
      
              const categoty = new Category({
                  _id: new mongoose.Types.ObjectId(),
                  title, // shortcut -> title: title
                  description,
      
              })
              categoty.save().then(()=>{
                  res.status(200).json({
                      message: 'Created a new category'
                  })
              })
      
          } catch(error){
             return res.status(500).json({
                  message: error
              })
          }

    }, 
    getCategory: (req,res)=>{

        try{
            const { _id } = req.body;
            Category.findById({_id}).then((users)=>{
                res.status(200).json({
                    message: users
                })
            })} catch (error){
               return res.status(500).json({
                    message: error
                })
            }

        },


    

    updateCategories: async(req,res)=>{
        if(req.body.description || req.body.title){
    try{
        await Category.findByIdandUpdate(req.body._id,req.body);
        res.status(200).json({
                message: 'Category Updated'
            })
        } catch (error){
           return res.status(500).json({
                message: error
            })
        }
    } else {
        return res.status(500).json({
            message: error
        })
    }
    

    },
    deleteCategories: async(req,res)=>{
        try{
            await Category.findByIdAndDelete(req.body._id);
            res.status(200).json({
                    message: 'Category deleted'
                })
            } catch (error){
               return res.status(500).json({
                    message: error
                })
            }
        

    } 

}

module.exports = routs;