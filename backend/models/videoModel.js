const mongoose = require('mongoose')
const Schema = mongoose.Schema


const VideoSchema = new Schema({
    title: {
        type:String,
        default: ''
    },
    url: {
        type:String,
        required: true
    },
    createdAt: {
        type:Date,
        default:Date.now 
    }
})


module.exports = mongoose.model('Video', VideoSchema)