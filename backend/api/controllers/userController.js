const User = require('../../models/userModel')
const { body, validationResult} = require('express-validator')
const debug = require('debug')('odin-book:userController')
const bcrypt = require('bcrypt')


exports.create_user_post = [
    body('name')
    .trim()
    .isLength({min:1})
    .escape(),
    body('password')
    .trim()
    .min(6).withMessage('Password must have min length of 6 characters')
    .matches(/^(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('must contain at least one uppercase letter')
    .matches(/^(?=.*[!@#$%^&()_+-])/).withMessage('must have at least one special character')
    .max(12).withMessage('Password cannot have more than 12 characters'),

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

                if (existingUser) {
                    res.status(400).json({
                        error: 'email',
                        message: 'Email already registered.'
                    })
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPw = await bcrypt.hash(password, salt)
                    const normalized_username = username.toLowerCase()

                    const newUser = new User({
                        name: name,
                        password: hashedPw,
                        phoneNumber: phone,
                        gender: gender,
                        email: formattedEmail

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