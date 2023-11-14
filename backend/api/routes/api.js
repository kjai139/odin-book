const express = require('express')
const { create_user_post, user_login_post } = require('../controllers/userController')
const router = express.Router()
const passport = require('../../passport')

router.post('/user/create', create_user_post )

router.post('/user/login', user_login_post)



module.exports = router