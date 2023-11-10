const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    name: {
        type:String,
        default: '',
        required: true,
        set: (value) => value.toLowerCase()
    },
    password: {
        type:String,
        required: true,
    },
    phoneNumber: {
        type:String,
        default: '',
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
    }],
    gender: {
        type:String,
        enum:['Male', 'Female', 'Other']
    }
})


module.exports = mongoose.model('User', UserSchema)
