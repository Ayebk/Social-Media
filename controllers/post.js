const User = require('../model/user');
const Post = require('../model/post');
const Category = require('../model/category');
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2;

// const upload = require('../middleware/upload');


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const routs = {





    getAllPosts: async (req, res) => {
        try {
            Post.find().sort('-createdAt').then((posts) => {
                res.status(200).json({
                    message: posts
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }


    },



    getFollowersPosts: async (req, res) => {
        const id = req.params.id;

        try {
            const currentUser = await User.findById(id).sort('-createdAt');
            const userPosts = await Post.find({ userId: currentUser._id }).sort('-createdAt');
            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => {
                    return Post.find({ userId: friendId });
                })
            );
            res.json(userPosts.concat(...friendPosts))
        } catch (err) {
            res.status(500).json(err);
        }

    },

    getCategoryPosts: async (req, res) => {
        const id = req.params.id;

        try {
            const category = await Category.findById(id);
            const categoryPosts = await Post.find({ categoryId: category._id }).then((posts) => {
                res.status(200).json({
                    message: posts
                })
            })
        }
        catch (err) {
            res.status(500).json(err);
        }

    },



    searchPosts: async (req, res) => {
        const text = req.params.text;
        const regex = new RegExp(escapeRegex(text), 'gi');

        try {
            Post.find({ "title": regex }).sort('-createdAt').then((posts) => {
                res.status(200).json({
                    message: posts
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }


    },

    searchPostsExact: async (req, res) => {
        const id = req.params.id;

        try {
            Post.findById( id ).then((post) => {
                res.status(200).json({
                    message: post
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }


    },

    getAllUserPosts: async (req, res) => {
        const id = req.params.id;

        try {
            Post.find({ "userId": id }).sort('-createdAt').then((users) => {
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




    createPosts: (async (req, res) => {

        const { title, userId, description, content, categoryId ,img } = req.body;
        console.log(title)


        Category.findById(categoryId).then((category) => {

            if (!category) {
                return res.status(404).json({
                    message: 'There is no such Catergory'
                })
            }

            const post = new Post({
                _id: new mongoose.Types.ObjectId(), //mongoose does it byself 
                userId,
                title, // short cut -> title: title
                description, // short cut -> description: description
                content, // short cut -> content: content
                categoryId,
                img


            });
            return post.save();
        }).then(() => {
            res.status(200).json({
                message: 'Created post'
            })
        }).catch(error => {
            res.status(500).json({
                error
            })

        })
            .catch(error => {
                res.status(500).json({
                    error
                })

            })
    }),



    getPost: async (req, res) => {
        try {
            const postId = req.params.postId;
            await Post.findById(postId).sort('-createdAt').then((users) => {
                res.status(200).json({
                    message: users
                })
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            })
        }


    },
    updatePosts: async (req, res) => {
        try {
            const postId = req.params.postId;

            const post = await Post.findById(postId);
            console.log(post)
            await post.updateOne({ $set: req.body });


            res.status(200).json({
                message: 'Post Updated'
            })

        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }

    },
    deletePosts: async (req, res) => {


        const postId = req.params.postId
        const userId = req.body.userId
        const userPostId = req.body.userPostId
        if (userId === userPostId) {

            try {

                const post = await Post.findById(postId);
                await post.deleteOne();
                res.status(200).json({
                    message: `Post _id:${postId} Deleted`
                })

            } catch (error) {
                res.status(500).json({
                    error
                })
            }
        }
        else {
            res.status(401).json({
                message: ' not auth'
            })
        }



    },
    like: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                console.log( req.body.userId);
                res.status(200).json("The post has been liked");
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.status(200).json("The post has been disliked");
            }
        }
        catch (err) {
            res.status(500).json(err);

        }


    },
    comment: async (req, res) => {
        try {
            const comment = {
                text: req.body.text,
                username: req.body.username,
                userId: req.body.userId
            }
            const post = await Post.findById(req.params.id);
            await post.updateOne({ $push: { comments: comment } }, { new: true })

                .then(p => console.log(p))
                .catch(error => console.log(error))
            res.status(200).json("commented")
        } catch (err) {
            res.status(500).json(err);
        }


    },


    deleteComment: async (req, res) => {
        try {
            const comment = req.body._id
            const post = await Post.findById(req.params.id);
            await post.updateOne({ $pull: { comments: {_id:comment} } })

                .then(p => console.log(p))
                .catch(error => console.log(error))
            res.status(200).json("commented removed")
        } catch (err) {
            res.status(500).json(err);
        }


    },


 


    getTrends: async (req, res) => {
        try {
            Post.find().sort({ likes: -1 }).limit(3).then((posts) => {
                res.status(200).json({
                    message: posts
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: error
            })
        }


    },

    


    //     Post.find().sort({viewCount: -1}).limit(5).exec().then((posts) => {
    //         res.status(200).json({
    //             message: posts
    //         })

    // })









}

module.exports = routs;