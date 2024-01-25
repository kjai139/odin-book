const Comment = require('../../models/commentModel')
const Post = require('../../models/postModel')
const debug = require('debug')('odin-book:commentController')

exports.comment_create_post = async (req, res) => {
    try {
        const newComment = new Comment({
            author: req.user._id,
            body: JSON.stringify(req.body.content)
        })

        await newComment.save()

        const thePost = await Post.findByIdAndUpdate(req.body.postId, {
            $addToSet: {
                comments: newComment._id
            }
        }).populate('author').populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        })
        debug('THE POST FROM CMT', thePost)


        res.json({
            updatedPost: thePost
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.comments_load_get = async (req, res) => {
    try {
        const { postId } = req.query
        debug(postId)
        const thePost = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        })
        debug('the post from load cmt', thePost)

        res.json({
            comments: thePost.comments
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}