
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../../models/userModel')
const debug = require('debug')('odin-book:authenticatejwt')

const { io } = require('../socket')

//handle after passport jwt
exports.authenticateJwt = (req, res, next) => {
    const { user, token } = req.user
    if (user) {
        debug(`user authenticated: ${user._id}`)
        
        res.json({
            success: true,
            user: user
        })
    } else {
        
        debug('Invalid or expired token')
        res.status(500).json({
            message: err,
            reroute: '/'
        })
    }
        
        
    
}

exports.refreshJwt = (req, res, next) => {
    const { user , token } = req.user

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
        sameSite: 'None'
    })

    req.user = user
    debug('refreshed jwt token sent to client')
    next()
}