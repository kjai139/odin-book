const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    name: {
        type:String,
        default: '',
        unique: true,
        required: true,
        set: (value) => value.toLowerCase()
    },
    password: {
        type:String,
        required: true,
    },
    email: {
        type:String,
        unique:true,
        required: true,
        set: (value) => value.toLowerCase()
    },
    image: {
        type:String,
        default: null
    },
    friendlist:[{
        type:Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    friendReq: [{
        type:Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }]
})


module.exports = mongoose.model('User', UserSchema)
