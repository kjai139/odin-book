
const jwtStrategy = require('passport-jwt').Strategy
require('dotenv').config()
const User = require('../../models/userModel')
const debug = require('debug')('odin-book:authenticatejwt')





exports.authenticateJwt = (req, res) => {
    if (req.user) {
        debug(`user authenticated: ${req.user}`)
        res.json({
            success: true,
            user: req.user
        })
    } else {
        debug('Invalid token', req.user)
    }
}