const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    body: {
        type:String,
        required: true
    },
    comments: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Comment'
        }

    ],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type:Number,
        default: 0
    }
})

module.exports = mongoose.model('Post', PostSchema)