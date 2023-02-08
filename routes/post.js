const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const upload = require('../middleware/upload');

const { getAllPosts , sign , searchPostsExact , deleteComment  , getCategoryPosts , getFollowersPosts, searchPosts, getTrends ,getAllUserPosts,createPosts, getPost, updatePosts, deletePosts , like, comment } = require('../controllers/post');

// you can put to a  rout ( , checkAuth , ) for auth


// gets all posts
router.get('/', getAllPosts)



// gets all posts of your followers (timeline)
router.get('/followers/:id', getFollowersPosts)


// gets all posts of your followers (timeline)
router.get('/category/:id', getCategoryPosts)

// search posts
router.get('/search/:text', searchPosts)


// search posts
router.get('/search/exact/:id', searchPostsExact)

// gets all trens
router.get('/getTrends', getTrends)

// gets all user posts
router.get('/userPosts/:id', getAllUserPosts)


// delets a posts
router.delete('/:postId',/*checkAuth,*/  deletePosts)

// gets a post
router.get('/:postId', getPost)

// post a post
router.post('/', upload.single('img'), checkAuth ,  createPosts)





// update a posts
router.put('/:postId',checkAuth,  updatePosts)


// like a posts
router.put('/:id/like', checkAuth ,  like)

// comment 
router.put('/:id/comment', checkAuth ,  comment)

// delete 
router.put('/:id/comment/delete', checkAuth ,  deleteComment)




module.exports = router;