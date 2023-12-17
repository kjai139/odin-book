const User = require('../../models/userModel')
const { body, validationResult} = require('express-validator')
const debug = require('debug')('odin-book:userController')
const bcrypt = require('bcrypt')
const passport = require('../../passport')
const mongoose = require('mongoose')
const { generateRandomString } = require('./imageController')
const { PutObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../../s3Client')


exports.create_user_post = [
    body('name')
    .trim()
    .isLength({min:1})
    .escape(),
    body('password')
    .trim()
    .isLength({min:6}).withMessage('Password must have min length of 6 characters')
    .matches(/^(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('must contain at least one uppercase letter')
    .matches(/^(?=.*[!@#$%^&()_+-])/).withMessage('must have at least one special character')
    .isLength({max:20}).withMessage('Password cannot have more than 20 characters'),

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            debug('error validating:', errors)
            res.status(400).json({
                message: errors
            })
        } else {
            try {
                debug('req body:', req.body)
                const { name, password, phone, gender } = req.body

                const formattedEmail = req.body.email.toLowerCase()

                const existingUser = await User.findOne({email: formattedEmail})

                if (phone !== undefined && phone !== null) {
                    debug('phone is not undefined')
                    const existingPhone = await User.findOne({
                        phoneNumber: phone
                    })

                    if (existingPhone) {
                        res.status(400).json({
                            error:'phone',
                            message: 'Phone number already registered'
                        })
                    }
                }

                if (existingUser) {
                    res.status(400).json({
                        error: 'email',
                        message: 'Email already registered.'
                    })
                } else {
                    debug('No collision, creating user...')
                    const salt = await bcrypt.genSalt(10)
                    const hashedPw = await bcrypt.hash(password, salt)
                    

                    const newUser = new User({
                        name: name,
                        password: hashedPw,
                        gender: gender,
                        email: formattedEmail,
                        phoneNumber: phone

                    })

                    await newUser.save()
                    res.json({
                        message: 'User created',
                        success: true
                    })

                }




                



            } catch (err) {
                
                res.status(500).json({
                    message: err.message
                })
            }


        }


    }
]


exports.user_login_post = async (req, res, next) => {
    
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            res.status(500).json({
                message: err
            })
        } else if (!user) {
            debug('info from !user: ', info)
            res.status(401).json({
                message: info?.message || 'Invalid login info.'
            })
        } else {
            const token = user
            

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 1000,
                sameSite: 'None'
            })
            debug('token sent to client', token)
            res.json({
                success: true
            })
        }


    })(req, res, next) //IIFE, err user and info is passed in next
    
}

exports.user_signOut_delete = async (req, res) => {
    debug('logging user out...')
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'None',
            secure:true
        })

        res.json({
            success: true,
            message: 'You have signed out successfully.'
        })
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}

exports.user_suggested_find = async (req, res) => {
    const numberofRandomUsers = 15

    try {
        const randomUsers = await User.aggregate([
            {
                $match: {
                    _id: {
                        $ne: new mongoose.Types.ObjectId(req.query.id)
                    },
                    friendlist: {
                        $nin: [
                            req.query.id
                        ]
                    } 
                }
            },
            {
                $sample: {
                    size: numberofRandomUsers
                }
            }
        ])

        res.json({
            suggestedFrds: randomUsers
        })
    } catch (err) {
        debug(err)
        res.status(500).json({
            message: err.nessage
        })
    }

    


}

//sending friend request - check if the user already friends with requester, if not, send friend request
exports.user_add_friend_req_post = async (req, res) => {

    const requesterId = req.body.userId


    try {
        const areUserNotFriends = await User.findOne({
            _id: req.body.id,
            friendlist: {
                $nin: [
                    requesterId
                ]
            }
        })

        if (areUserNotFriends) {
            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: req.body.id,
                    friendReq: {
                        $nin: [
                            requesterId
                        ]
                    }
                }, {
                    
                    $addToSet: {
                        friendReq: requesterId
                    }
                    
                }, {
                    new: true
                })
        
                if (updatedUser) {
                    res.json({
                        success: true,
                        message: `Friend request sent to user ${req.body.id}`
                    })
                } else {
                    res.json({
                        success: false,
                        message: `Friend request is already pending.`
                    })
                }
        } else {
            res.json({
                success: false,
                message: `You are already friends`
            })
        }
        
       


        
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}


exports.user_friendreq_get = async (req, res) => {
    try {
        const userId = req.query.get

        const user = await User.findById(userId).populate('friendReq')

        res.json({
            success: true,
            newUser: user
        })

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}


exports.user_fl_get = async (req, res) => {
    try {
        const userId = req.query.get

        const user = await User.findById(userId).populate('friendlist')

        res.json({
            success: true,
            newUser: user
        })

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}


exports.user_pfp_change = async (req, res) => {
    try {
        const imageFileName = req.file.originalname.replace(/ /g, '_')
        const s3randomString = generateRandomString(5)
        const bucketName = 'odinbookkjai'
        
        const params = {
            Bucket: bucketName,
            Key: `images/temp/${s3randomString}_${imageFileName}`,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)
        const response = await s3Client.send(command)

        res.json({
            success: true,
            message: `image uploaded successfully. URL:https://${bucketName}.s3.us-east-2.amazonaws.com/${params.Key}`,
            url:`https://${bucketName}.s3.us-east-2.amazonaws.com/${params.Key}`
        })

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}

exports.user_pfp_save = async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl
        const userId = req.user._id
        const urlParts = imageUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const bucketName = 'odinbookkjai'

        const copyParams = {
            Bucket: bucketName,
            Key: `images/perm/${fileName}`,
            CopySource:`${bucketName}/images/temp/${fileName}`,
            ACL: 'public-read',
        }

        const copyCommand = new CopyObjectCommand(copyParams)
        const response = await s3Client.send(copyCommand)

        debug('user pfp saved to s3')

        const existingUser = await User.findByIdAndUpdate(userId, {
            image: `https://${bucketName}.s3.us-east-2.amazonaws.com/${copyParams.Key}`
        }, { new: true })

        res.json({
            success: true,
            message: `User pfp updated. new url:https://${bucketName}.s3.us-east-2.amazonaws.com/${copyParams.Key}`,
            updatedImage: existingUser.image
        })




       

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}