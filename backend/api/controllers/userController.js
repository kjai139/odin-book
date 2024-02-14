const User = require('../../models/userModel')
const { body, validationResult} = require('express-validator')
const debug = require('debug')('odin-book:userController')
const bcrypt = require('bcrypt')
const passport = require('../../passport')
const mongoose = require('mongoose')
const { generateRandomString } = require('./imageController')
const { PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../../s3Client')
const socketConfig = require('../socket')
const Post = require('../../models/postModel')
const Comment = require('../../models/commentModel')


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
                            new mongoose.Types.ObjectId(req.query.id)
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
                    
                    socketConfig.io.to(req.body.id).emit('incFrdReq', {
                        updatedFrdReq: updatedUser.friendReq
                    })
                    
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
            message: err.message
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

        if (req.user.image) {
            const oldUrlParts = req.user.image.split('/')
            const oldFileName = oldUrlParts[oldUrlParts.length - 1]
            const deleteParams = {
                Bucket: bucketName,
                Key: `images/perm/${oldFileName}`
            }

            const data = await s3Client.send(new DeleteObjectCommand(deleteParams))
            debug(`image @${deleteParams.Key} deleted.`, data)
        }

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


exports.user_bio_update_post = async (req, res) => {
    try {
        const content = JSON.stringify(req.body.content)
        const theUser = await User.findByIdAndUpdate(req.user._id, {
            bio: content
        }, {
            new: true
        })

        debug('FROM UPDATE BIO POST:', theUser.bio)

        res.json({
            updatedBio: theUser.bio
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.user_get_updatedBio = async (req, res) => {
    
    res.json({
        updatedBio: req.user.bio
    })
}

exports.user_getPage_get = async (req, res) => {
    try {
        console.log('GETTING PAGE:', req.query.id)
        const userId = req.query.id
        const postperPage = 5
        const skip = (req.query.pageNum - 1) * postperPage
        const totalPosts = await Post.countDocuments({ author: req.query.id})
        const totalPages = Math.ceil( totalPosts / postperPage)

        const userInfo = await User.findById(userId).populate({
            path: 'posts',
            options: {
                sort: { createdAt: -1},
                limit: 3
            }
        })
        //recent posts + comments but just going to have posts instead

        /* const [recentPosts, recentCmts] = await Promise.all([
            Post.find({ author: req.query.id }).sort({ createdAt: -1}).limit(5),
            Comment.find({ author: req.query.id}).sort({ createdAt: -1}).limit(5)

        ])

        const combinedResults = [...recentPosts, ...recentCmts].sort((a, b) => b.createdAt - a.createdAt) */

        const recentPosts = await Post.find({ author: req.query.id}).sort({ createdAt: -1}).skip(skip).limit(postperPage).populate('author').populate('videos')

        res.json({
            userInfo: userInfo,
            recentPosts: recentPosts,
            totalPages: totalPages
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.user_page_getMore = async (req, res) => {
    
   
    try {
        const postPerPage = 5
        const skip = (req.query.page - 1) * postPerPage
        const totalPosts = await Post.countDocuments({ author: req.query.id})
        const totalPages = Math.ceil( totalPosts / postPerPage)
        debug('totaluserpages:', totalPages)
        debug('curuserPage:', req.query.page )

        if (totalPages >= req.query.curPage ) {
            const newPosts = await Post.find({ author: req.query.id}).sort({ createdAt: -1}).skip(skip).limit(postPerPage).populate('author').populate('videos')

            res.json({
                newPage: newPosts,
                totalPages: totalPages,
                
            })
        } else {
            res.json({
                newPage: null
            })
        }

        



    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}