const JwtStrategy = require('passport-jwt').Strategy

const jwt = require('jsonwebtoken')
const User = require('./models/userModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const debug = require('debug')('odin-book:passport')
const bcrypt = require('bcrypt')

require('dotenv').config()

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
                        _id: user._id,
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
                            _id: user._id,
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


const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['jwt']
    }

    return token
}

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY
}

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    debug('passport jwt started:', jwt_payload)

    try {
        
        const user = await User.findById(jwt_payload._id)

        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (err) {
        return done(err)
    }
}))




module.exports = passport;