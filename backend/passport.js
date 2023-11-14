const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const jwt = require('jsonwebtoken')
const User = require('./models/userModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const debug = require('debug')('odin-book:passport')
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy(
    // {
    //     usernameField: ''
    // }, set if not using default username and password fields
    async (username, password, done) => {
        try {
            const user = await User.findOne({
                email: username
            })

            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password)

                if (passwordMatch) {
                    const token = jwt.sign({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        image: user.image,
                        gender: user.gender,
                        friendlist: user.friendlist,
                        friendReq: user.friendReq


                    }, process.env.JWT_SECRET_KEY, {
                        expiresIn: '1hr'
                    })

                    return done(null, token)

                } else { //pw don't match, null false for res status 401
                    return done(null, false, {
                        message: 'Incorrect password.'
                    })
                }
            } else { //login with phone
                const nospaceUsername = username.replace(/\s/g, '')
                const userPhone = await User.findOne({
                    phoneNumber: nospaceUsername
                })

                if (userPhone) {
                    const passwordMatch = await bcrypt.compare(password, user.password)

                    if (passwordMatch) {
                        const token = jwt.sign({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            phoneNumber: user.phoneNumber,
                            image: user.image,
                            gender: user.gender,
                            friendlist: user.friendlist,
                            friendReq: user.friendReq
    
    
                        }, process.env.JWT_SECRET_KEY, {
                            expiresIn: '1hr'
                        })
    
                        return done(null, token)
                    } else {
                        //pw not match
                        return done(null, false, {
                            message: 'Incorrect password.'
                        })
                    }
                    
                } else {//nothing matched login
                    return done(null, false, {
                        message: 'Please enter valid email or phone number.'
                    })
                }
            }

        } catch(err) {
            return done(err)
        }
    }
))







module.exports = passport;