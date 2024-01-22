const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentSchema = new Schema({
    author: {
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    likes: {
        type:Number,
        default: 0
    },
    dislikes: {
        type:Number,
        default: 0
    }
})

module.exports = mongoose.model('Comment', CommentSchema)