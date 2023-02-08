const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.NODEMAILER_API_KEY
    }
}))



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const routs = {
    signup: (req, res) => {
        //  const { path: img } = req.file;

        const { email, password, username } = req.body; // shortcut -> email = email
        try {
            User.find({ email }).then((users) => {

                if (users.length >= 1) {
                    return res.status(409).json({ message: 'This email already exists' })
                }

            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
        bcrypt.hash(password, 10, (error, hash) => {
            if (error) {
                return res.status(500).json(error)
            }
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email, // shortcut -> email: email
                username,
                password: hash,
                //           img : img.replace('\\','/')
            })

            user.save().then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-replay@Sharing",
                    subject:"signup success",
                    html:"<h1>welcome to Sharing !</h1>"
                })
                res.status(200).json({message:"saved successfully"})
            })
            .catch(error => {
                res.status(500).json({
                    message: error
                })
            })

        });


    },

    login: (req, res) => {
        const { email, password } = req.body; // shortcut -> email = email

        User.find({ email }).then((users) => {

            if (users.length === 0) {
                return res.status(401).json({ message: 'Authoriztion failed' });
            }



            const [user] = users;
            bcrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Auth failed '
                    })
                }
                if (result) {
                    const {_id,username,email,followers,followings,img} = user
                    const token = jwt.sign({
                        id: user._id,
                        email: user.email
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).json({
                        message: 'Connected Successfully',
                        token,
                        user:{_id,username,email,img}
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                })
            })


        });



    },

    getuser: async (req, res) => {
        if(req.params.id){
        try {
            const users = req.params.id;
            
            if (users) {
                
              
            
            User.findById( users ).then((user) => {
                if (user.length === 0) {
                    return res.status(200).json({
                        message: 'There no such user'
                    })
                } else {
                    const { password, updatedAt, ...other } = user._doc;
                    res.status(200).json(other);
                }

            })
        } } catch (error) {
            return res.status(500).json({
                message: error
            })
        }}
    },






    updateuser: async (req, res) => {
        console.log(req.file);

        if (req.body._id !== req.params.id) {
            return res.status(403).json({
                message: 'Forbidden Action'
            })

        }
        if (req.body.password) {
            const newPassword = req.body.password;
            console.log(newPassword);

            await bcrypt.hash(newPassword, 10, async (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        message: error
                    })
                }
                console.log(hash);
                try {
                    await User.findByIdandUpdate(req.body._id, { $set: { password: hash } });
                    return res.status(200).json({
                        message: 'Password has been updated'
                    })
                } catch (error) {
                    return res.status(500).json({
                        message: error
                    })
                }
            }

            )

        }
        if (req.body.username) {
            try {
                await User.findByIdandUpdate(req.body._id, { $set: { username: req.body.username } });
                return res.status(200).json({
                    message: 'Name has been updated'
                })
            } catch (error) {
                return res.status(500).json({
                    message: error
                })

            }

        }
        if (req.body.img) {
            try {
                await User.findByIdandUpdate(req.body._id, { $set: { img: req.body.img } });
                return res.status(200).json({
                    message: 'img has been updated'
                })
            }
            catch (error) {
                return res.status(500).json({
                    message: error
                })

            }

        }

    },
    deleteuser: async (req, res) => {
        if (req.body._id !== req.params.id) {
            return res.status(403).json({
                message: 'Forbidden Action'
            })

        }
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }


    },
    follow: async (req, res) => {
        if (req.body._id === req.params.id) {
            return res.status(403).json({
                message: 'You cant follow tour self'
            })
        }

        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body._id);
            if (!user.followers.includes(req.body._id)) {
                await user.updateOne({ $push: { followers: req.body._id } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already follow this user")
            }
        } catch (err) {
            res.status(403).json(err)

        }

    }
    ,
    unfollow: async (req, res) => {

        if (req.body._id !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body._id);
                if (user.followers.includes(req.body._id)) {
                    await user.updateOne({ $pull: { followers: req.body._id } });
                    await currentUser.updateOne({ $pull: { followings: req.params.id } });
                    res.status(200).json("user has been unfollowed");
                } else {
                    res.status(403).json("you dont follow this user")
                }
            } catch (err) {
                res.status(403).json(err)

            }
        } else {
            res.status(403).json("you cant unfollow yourself")
        }


    },

    friends: async (req,res)=>{


        try {
            const user = await User.findById(req.params.id)
            const friends = await Promise.all(
              user.followings.map((friendId) => {
                return User.findById(friendId);
              })
            );
            let friendList = [];
            friends.map((friend) => {
              const { _id, username, img } = friend;
              friendList.push({ _id, username, img });
            });
            res.status(200).json(friendList)
          } catch (err) {
            res.status(500).json(err);
          }

    },
    popular: async (req,res)=>{

        try {
            User.find({ "followings.0": { "$exists": true }}).sort({followings: -1}).limit(3).then((users) => {
                res.status(200).json({
                    message: users
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }

    },

    searcUsers: async (req, res) => {
        const text = req.params.text;
        const regex = new RegExp(escapeRegex(text), 'gi');

        try {
            User.find({ "username": regex }).then((users) => {
                res.status(200).json({
                    message: users
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }


    },


    resetPassword: (req,res)=>{
        crypto.randomBytes(32,(err,buffer)=>{
            if(err){
                console.log(err)
            }
            const token = buffer.toString("hex")
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:"User dont exists with that email"})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result)=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"AYEBK123@GMAIL.COM",
                        subject:"password reset",
                        html:`<p>You requested for password reset</p><h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>`
                    })
                    res.json({message:"check your email"})
                })
   
            })
        })
   },
   
   
   newPassword:(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
},


getuserAuth: async (req, res) => {
    
    try {
        const users = req.params.id;
        
    
        User.findById( users ).then((user) => {
            if (user.length === 0) {
                return res.status(200).json({
                    message: 'There no such user'
                })
            } else {
                const { password, updatedAt, ...other } = user._doc;
                res.status(200).json(other);
               
            }

        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
},

}
module.exports = routs;