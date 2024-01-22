const Comment = require('../../models/commentModel')
const Post = require('../../models/postModel')


exports.comment_create_post = async (req, res) => {
    try {
        const newComment = new Comment({
            author: req.user._id,
            body: req.body.content
        })

        await newComment.save()

        const thePost = await Post.findByIdAndUpdate(req.user._id, {
            $addToSet: {
                comments: newComment._id
            }
        }).populate('author').populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        })

        res.json({
            updatedPost: thePost
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}