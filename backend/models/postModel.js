const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Video = require('../models/videoModel')
const User = require('../models/userModel')

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
    didUserLike: {
        type:Boolean,
        default: false
    },
    didUserDislike: {
        type:Boolean,
        default: false
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    videos: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Video',
        }
    ]
})

module.exports = mongoose.model('Post', PostSchema)