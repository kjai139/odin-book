
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../../models/userModel')
const debug = require('debug')('odin-book:authenticatejwt')





exports.authenticateJwt = (req, res, next) => {
    if (req.user) {
        debug(`user authenticated: ${req.user}`)
        res.json({
            success: true,
            user: req.user
        })
    } else {
        try {
            const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY)

            req.user = decodedToken
            debug('user is logged in:', req.user)
            next()

        } catch (err) {
            debug('Invalid or expired token')
            res.status(500).json({
                message: err
            })
        }
        

        
    }
}