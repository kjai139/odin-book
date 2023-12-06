
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../../models/userModel')
const debug = require('debug')('odin-book:authenticatejwt')

const { io } = require('../socket')

//handle after passport jwt
exports.authenticateJwt = (req, res, next) => {
    if (req.user) {
        debug(`user authenticated: ${req.user._id}`)
        
        res.json({
            success: true,
            user: req.user
        })
    } else {
        
        debug('Invalid or expired token')
        res.status(500).json({
            message: err,
            reroute: '/'
        })
    }
        
        
    
}