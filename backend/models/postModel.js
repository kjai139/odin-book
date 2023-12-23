const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,

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
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    videos: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Video',
            default:null
        }
    ]
})

module.exports = mongoose.model('Post', PostSchema)