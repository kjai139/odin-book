const Post = require('../../models/postModel')
const User = require('../../models/userModel')
const debug = require('debug')('odin-book:postController')
const { CopyObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../../s3Client')
const { generateRandomString } = require('./imageController')
const Video = require('../../models/videoModel')
const mongoose = require('mongoose')


exports.post_create_post = async (req, res) => {
    try {
        const content = req.body.content
        //turn temp imgs to perm in s3
        for (const node of content.content) {
            if (node.type && node.type === 'image') {
                let url = node.attrs.src
                debug('image url found:', url)
                let urlParts = url.split('/')
                const bucketName = 'odinbookkjai'
                let fileName = urlParts[urlParts.length - 1]
                debug('Image filename:', fileName)

                const copyParams = {
                    Bucket: bucketName,
                    Key: `images/perm/${fileName}`,
                    CopySource:`${bucketName}/images/temp/${fileName}`,
                    ACL: 'public-read',
                }

                const copyCommand = new CopyObjectCommand(copyParams)
                const response = await s3Client.send(copyCommand)

                node.attrs.src = `https://${bucketName}.s3.us-east-2.amazonaws.com/${copyParams.Key}`




            }
        }
        //create the post
        const newPost = new Post({
            author: req.user._id,
            body: JSON.stringify(content),

        })

        await newPost.save()

        const theUser = await User.findOneAndUpdate({_id: req.user._id}, {
            $addToSet: {
                posts: newPost._id
            }, 
        }, {new: true}).populate({
            path: 'posts',
            options: {
                limit: 10,
                sort : {
                    createdAt: -1
                },
                populate: {
                    path: 'author',
                    
                }
            }
        })




        
        

        res.json({
            message: 'Post created',
            success: true,
            updatedUser: theUser,
            mostRecentPost: newPost
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.post_vid_create_post = async (req, res) => {
    try {
        const bucketName = 'odinbookkjai'
        debug('file:', req.file)
        debug('body', req.body)

        const newVideo = new Video({
            url: `https://${bucketName}.s3.us-east-2.amazonaws.com/${req.file.key}`
        })
        
        await newVideo.save()
        


        const newPost = new Post({
            author: req.user._id,
            videos: newVideo._id,
            body: req.body.content
            
        })

        await newPost.save()

        const theUser = await User.findOneAndUpdate({_id: req.user._id}, {
            $addToSet: {
                posts: newPost._id
            }, 
        }, {new: true}).populate({
            path: 'posts',
            match: {
                'videos': {
                    $ne: []
                }
            },
            options: {
                limit: 10,
                sort : {
                    createdAt: -1
                },
                populate: {
                    path: 'author',
                    
                }
            }
        })

        
        
        
        res.json({
            success: true,
            message: `video uploaded successfully. URL:https://${bucketName}.s3.us-east-2.amazonaws.com/${req.file.key}`,
            url:`https://${bucketName}.s3.us-east-2.amazonaws.com/${req.file.Key}`,
            updatedUser: theUser,
            mostRecentPost: newPost
        })

    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.video_posts_get = async (req, res) => {
    const theUser = await User.findById(req.user._id).populate({
        path: 'posts',
        match: {
            videos: {
                $exists:true,
                $ne: [],
            }
        },
        options: {
            sort: {
                createdAt: -1
            }
        },
        populate: [{
            path: 'videos',
            model: 'Video'
        },{
            path: 'author',
            model: 'User'
        }]
    })

    res.json({
        updatedUser: theUser
    })
}

exports.postOnly_get = async (req, res) => {
    try {
        const theUser = await User.findById(req.user._id).populate({
            path: 'posts',
            /* match: {
                videos: {
                    $exists: false
                }
            }, */
            options: {
                sort: {
                    createdAt: -1
                },
                limit: 10
            },
            populate: [{
                path: 'author',
                model: 'User'
            }, {
                path: 'videos',
                model: 'Video'
            }]
        })

        res.json({
            recentPosts: theUser.posts
        })
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.postTimeline_get = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id)

        const mostRecentPost = await Post.find({ author: req.user._id}).sort({createdAt: -1}).limit(1).populate('author')
        

        const posts = await Post.aggregate([
            {
                $lookup: {
                   from: 'users',
                   localField: 'author',
                   foreignField: '_id',
                   as: 'author'
                }
                
            },
            {
                $unwind: '$author'
            },
            {
                $match: {
                    $or: [
                        {
                            'author.friendlist': {
                                $in: [userId]
                            }
                        },
                       /*  {
                            'authorInfo._id': userId
                        } */
                    ]
                   
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 5
            }
        ])

        

        debug('posts timeline:', posts, userId)

        

        res.json({
            timeline: posts,
            updatedBio: req.user.bio,
            mostRecent: mostRecentPost
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}



exports.post_likePost_post = async (req, res) => {
    try {
        const postId = req.body.postId
        const thePost = await Post.findById(postId).populate('author')

        if (thePost.didUserLike && !thePost.didUserDislike) {
            thePost.likes -= 1
            thePost.didUserLike = false
            

        } else if (!thePost.didUserLike && thePost.didUserDislike) {
            thePost.likes += 1
            thePost.dislikes -= 1
            thePost.didUserDislike = false
            thePost.didUserLike = true
        } else if (!thePost.didUserLike && !thePost.didUserDislike) {
            thePost.likes += 1
            thePost.didUserLike = true
        }

        const updatedPost = await thePost.save()

        res.json({
            updatedPost: updatedPost
        })




    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.post_dislike_post = async (req, res) => {
    try {
        const postId = req.body.postId
        const thePost = await Post.findById(postId).populate('author')

        if (thePost.didUserDislike && !thePost.didUserLike) {
            thePost.didUserDislike = false
            thePost.dislikes -= 1
        } else if (!thePost.didUserDislike && thePost.didUserLike) {
            thePost.didUserLike = false
            thePost.didUserDislike = true
            thePost.dislikes += 1
            thePost.likes -= 1
        } else if (!thePost.didUserDislike && !thePost.didUserLike) {
            thePost.didUserDislike = true
            thePost.dislikes += 1
        }

        const updatedPost = await thePost.save()

        res.json({
            updatedPost: updatedPost
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}