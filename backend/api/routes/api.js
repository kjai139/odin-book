const express = require('express')
const { create_user_post } = require('../controllers/userController')
const router = express.Router()


router.post('/user/create', create_user_post )





module.exports = router