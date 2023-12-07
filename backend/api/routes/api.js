const express = require('express')
const { create_user_post, user_login_post, user_signOut_delete, user_suggested_find } = require('../controllers/userController')
const router = express.Router()
const passport = require('../../passport')
const { authenticateJwt } = require('../middleware/authenticateJwt')
const multer = require('multer')
const { image_temp_upload_post } = require('../controllers/imageController')
const { post_create_post } = require('../controllers/postController')

const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits:{ fileSize: 2 * 1024 * 1024} })

router.post('/user/create', create_user_post )

router.post('/user/login', user_login_post)

router.get('/auth/check', passport.authenticate('jwt', {session: false}), authenticateJwt )

router.delete('/auth/signOut', user_signOut_delete)

router.get('/auth/facebook', passport.authenticate('facebook', {session: false}), authenticateJwt )

router.post('/image/temp/post', passport.authenticate('jwt', {session: false}), upload.single('image'), image_temp_upload_post)

router.post('/post/create', passport.authenticate('jwt', {session: false}), post_create_post)

router.get('/user/gsf', user_suggested_find)

module.exports = router