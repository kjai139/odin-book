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
    }
})

module.exports = mongoose.model('Post', PostSchema)