const Post = require('../../models/postModel')
const User = require('../../models/userModel')
const debug = require('debug')('odin-book:postController')
const { CopyObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../../s3Client')

exports.post_create_post = async (req, res) => {
    try {
        const content = req.body.content
        //turn temp imgs to perm in s3
        for (node of content) {
            if (node.type === 'image') {
                let url = node.attrs.src
                debug('image url found:', url)
                let urlParts = url.split('/')
                const bucketName = 'odinbookkjai'
                let fileName = urlParts[urlParts.length - 1]
                debug('Image filename:', fileName)

                const copyParams = {
                    Bucket: bucketName,
                    Key: `images/perm/${fileName}`,
                    CopySource:`${bucketName}/images/temp/${fileName}`
                }

                const copyCommand = new CopyObjectCommand(copyParams)
                const response = await s3Client.send(copyCommand)

                node.attrs.src = `https://${bucketName}.s3.us-east-2-amazonaws.com/${copyParams.Key}`




            }
        }
        //create the post
        const newPost = new Post({
            author: req.user._id,
            body: content,

        })

        await newPost.save()

        const theUser = await User.updateOne({_id: req.user._id}, {
            $addToSet: {
                posts: newPost._id
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