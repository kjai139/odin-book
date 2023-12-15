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
    },
    facebookId: {
        type:String,
        default: null
    },
    posts: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Post',
            default: null
        }
    ],
    status: {
        type:String,
        enum: ['online', 'offline', 'away'],
        default: 'offline'
    },
    uniqueId: {
        unique: true,
        type: String,
        
        

    }
})

function generateUniqueId () {
    const randomNumber = Math.floor(1000 + Math.random() * 9000 )


    return String(randomNumber)
   

    
}

//arrow functions don't bind this
UserSchema.pre('save', async function(next) {
    try {
        if (!this.uniqueId) {
            console.log('Generated randomId:', randomId)
            let randomId = generateUniqueId()
            let existingUser = await this.constructor.findOne({
                uniqueId: randomId,
                name: this.name
            })
    
            while (existingUser) {
                randomId = generateUniqueId()
                existingUser = await this.constructor.findOne({
                    uniqueId: randomId,
                    name: this.name
                })
            }

            this.uniqueId = randomId
            console.log('After save:', this)
        }

        next()


        

    } catch (err) {
        next(err)
    }
})

module.exports = mongoose.model('User', UserSchema)
