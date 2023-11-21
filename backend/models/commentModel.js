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
    }
})

module.exports = mongoose.model('Comment', CommentSchema)