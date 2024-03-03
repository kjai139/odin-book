const Comment = require('../../models/commentModel')
const Post = require('../../models/postModel')
const debug = require('debug')('odin-book:commentController')

exports.comment_create_post = async (req, res) => {
    try {
        const cmtPerPage = 3
        const pageNum = req.body.pageNum
        const skip = (pageNum - 1) * cmtPerPage
        const totalskip = req.body.skip + 1 + skip
        
        
        const newComment = new Comment({
            author: req.user._id,
            body: JSON.stringify(req.body.content)
        })

        await newComment.save()
        await newComment.populate('author')

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
                skip: totalskip,
                limit: cmtPerPage
            }
        })

        const totalComments = await Post.findById(req.body.postId).populate('comments').select('comments').then(post => post.comments.length)
        const totalPages = Math.ceil(totalComments / cmtPerPage)
        /* debug('THE POST FROM CMT', thePost) */


        res.json({
            updatedComments: thePost.comments,
            totalPages: totalPages,
            newUserComment: newComment,
            totalComments: totalComments
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.comments_load_get = async (req, res) => {
    try {
        const { postId, pageNum, skip } = req.query
        const cmtPerPage = 3
        const baseSkip = (pageNum - 1) * cmtPerPage
        const totalSkip = Number(skip) + baseSkip
        
        debug('LOADING COMMENTS WITH TOTAL SKIP:', totalSkip)
        const totalComments = await Post.findById(postId).populate('comments').select('comments').then(post => post.comments.length)
        const totalPages = Math.ceil(totalComments / cmtPerPage)

        const thePost = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'author'
            },
            options: {
                sort: { createdAt: -1 },
                skip: totalSkip,
                limit: cmtPerPage
            }
            
        })
        debug('the post from load cmt', thePost)

        res.json({
            comments: thePost.comments,
            totalPages: totalPages,
            totalComments: totalComments,
            curPage: pageNum
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}