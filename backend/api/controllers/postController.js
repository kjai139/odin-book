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
            message: 'post created',
            success: true,
            updatedUser: theUser
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
            updatedUser: theUser
        })

    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}