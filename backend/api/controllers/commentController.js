const Comment = require('../../models/commentModel')
const Post = require('../../models/postModel')
const debug = require('debug')('odin-book:commentController')

exports.comment_create_post = async (req, res) => {
    try {
        const cmtPerPage = 3
        const pageNum = req.body.pageNum
        const skip = (pageNum - 1) * cmtPerPage
        
        const totalComments = await Post.findById(req.body.postId).populate('comments').select('comments').then(post => post.comments.length)
        const totalPages = Math.ceil(totalComments / cmtPerPage)
        const newComment = new Comment({
            author: req.user._id,
            body: JSON.stringify(req.body.content)
        })

        await newComment.save()

        const thePost = await Post.findByIdAndUpdate(req.body.postId, {
            $addToSet: {
                comments: newComment._id
            }
        }, {
            new: true
        }).populate('author').populate({
            path: 'comments',
            populate: {
                path: 'author'
            },
            options: {
                sort: { createdAt: -1 },
                skip: skip,
                limit: cmtPerPage
            }
        })
        /* debug('THE POST FROM CMT', thePost) */


        res.json({
            updatedComments: thePost.comments,
            totalPages: totalPages
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.comments_load_get = async (req, res) => {
    try {
        const { postId, pageNum } = req.query
        const cmtPerPage = 3
        const skip = (pageNum - 1) * cmtPerPage
        debug(postId)
        const totalComments = await Post.findById(postId).populate('comments').select('comments').then(post => post.comments.length)
        const totalPages = Math.ceil(totalComments / cmtPerPage)

        const thePost = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'author'
            },
            options: {
                sort: { createdAt: -1 },
                skip: skip,
                limit: cmtPerPage
            }
            
        })
        debug('the post from load cmt', thePost)

        res.json({
            comments: thePost.comments,
            totalPages: totalPages,
            totalComments: totalComments
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}