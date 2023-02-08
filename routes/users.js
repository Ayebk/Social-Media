const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const checkAuth = require('../middleware/checkAuth');

const {signup, login,getuserAuth, resetPassword, newPassword, popular, searcUsers, getuser ,updateuser, deleteuser ,follow ,unfollow, friends} = require('../controllers/user');

// you can put to a  rout ( , checkAuth , ) for auth

//signup
router.post('/signup',upload.single('img'),signup );

//login
router.post('/login',login );

//get user
router.get('/getuser/:id', getuser); 

//update user
router.put('/:id/updateuser',upload.single('img'), updateuser);

//delete user
router.delete('/:id/deleteuser',checkAuth,deleteuser);

//follow user
router.put('/:id/follow', checkAuth ,follow);

//unfollow user
router.put('/:id/unfollow', checkAuth ,unfollow);

//get friends

router.get('/friends/:id',friends);

//get random users (with at least 1 follower)

router.get('/popular',popular);


// search posts
router.get('/search/:text', searcUsers)


// reset password
router.post('/reset-password',resetPassword)

// new password
router.post('/new-password',newPassword)



//get user with Auto
router.get('/getuser/auth/:id', checkAuth, getuserAuth); 

module.exports =  router;