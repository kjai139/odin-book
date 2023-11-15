const express = require('express')
const { create_user_post, user_login_post } = require('../controllers/userController')
const router = express.Router()
const passport = require('../../passport')
const { authenticateJwt } = require('../middleware/authenticateJwt')

router.post('/user/create', create_user_post )

router.post('/user/login', user_login_post)

router.get('/auth/check', passport.authenticate('jwt', {session: false}), authenticateJwt )



module.exports = router