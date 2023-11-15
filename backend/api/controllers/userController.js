const User = require('../../models/userModel')
const { body, validationResult} = require('express-validator')
const debug = require('debug')('odin-book:userController')
const bcrypt = require('bcrypt')
const passport = require('../../passport')


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
                    const salt = await bcrypt.genSalt(10)
                    const hashedPw = await bcrypt.hash(password, salt)
                    

                    const newUser = new User({
                        name: name,
                        password: hashedPw,
                        gender: gender,
                        email: formattedEmail,
                        ...(phone && {
                            phoneNumber: phone,
                        })

                    })

                    await newUser.save()
                    res.json({
                        message: 'User created',
                        success: true
                    })

                }




                



            } catch (err) {
                
                res.status(500).json({
                    message: err
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