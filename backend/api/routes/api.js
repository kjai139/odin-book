const express = require('express')
const { create_user_post, user_login_post, user_signOut_delete, user_suggested_find, user_add_friend_req_post, user_friendreq_get, user_fl_get, user_pfp_change, user_pfp_save } = require('../controllers/userController')
const router = express.Router()
const passport = require('../../passport')
const { authenticateJwt } = require('../middleware/authenticateJwt')
const multer = require('multer')
const { image_temp_upload_post } = require('../controllers/imageController')
const { post_create_post, post_vid_create_post, video_posts_get, postOnly_get } = require('../controllers/postController')

const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits:{ fileSize: 2 * 1024 * 1024} })
const s3Client = require('../../s3Client')
const multerS3 = require('multer-s3')
const { friendsRequest_accept_post, friendsDelete_post } = require('../controllers/friendsController')

const s3Upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'odinbookkjai',
        metadata: function (req, file, cb) {
            
            cb(null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {
            cb(null, `videos/temp/${Date.now().toString()}${file.originalname}`)
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read'

    })
})

router.post('/user/create', create_user_post )

router.post('/user/login', user_login_post)

router.get('/auth/check', passport.authenticate('jwt', {session: false}), authenticateJwt )

router.delete('/auth/signOut', user_signOut_delete)

router.get('/auth/facebook', passport.authenticate('facebook', {session: false}), authenticateJwt )

router.post('/image/temp/post', passport.authenticate('jwt', {session: false}), upload.single('image'), image_temp_upload_post)

router.post('/post/create', passport.authenticate('jwt', {session: false}), post_create_post)

router.get('/user/gsf', user_suggested_find)

router.post('/user/addfrd', passport.authenticate('jwt', {session: false}), user_add_friend_req_post)

router.get('/user/friendrequests', passport.authenticate('jwt', {session: false}), user_friendreq_get)

router.get('/user/updateFL', passport.authenticate('jwt', {session: false}), user_fl_get)

router.post('/user/updatepfp', passport.authenticate('jwt', {session: false}), upload.single('file'), user_pfp_change)

router.post('/user/savepfp', passport.authenticate('jwt', { session: false}), user_pfp_save)

router.post('/post/create2', passport.authenticate('jwt', {session: false}), s3Upload.single('video'), post_vid_create_post)

router.get('/vids/get', passport.authenticate('jwt', {session: false}), video_posts_get)

router.get('/postsOnly/get', passport.authenticate('jwt', {session: false}), postOnly_get)


router.post('/friends/accept', passport.authenticate('jwt', {session: false}), friendsRequest_accept_post)

router.post('/friends/remove', passport.authenticate('jwt', {session: false}), friendsDelete_post)

module.exports = router