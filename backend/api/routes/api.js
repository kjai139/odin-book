const express = require('express')
const { create_user_post, user_login_post, user_signOut_delete, user_suggested_find, user_add_friend_req_post, user_friendreq_get, user_fl_get, user_pfp_change, user_pfp_save, user_bio_update_post, user_get_updatedBio, user_getPage_get, user_page_getMore, user_login_facebook } = require('../controllers/userController')
const router = express.Router()
const passport = require('../../passport')
const { authenticateJwt, refreshJwt } = require('../middleware/authenticateJwt')
const multer = require('multer')
const { image_temp_upload_post } = require('../controllers/imageController')
const { post_create_post, post_vid_create_post, video_posts_get, postOnly_get, postTimeline_get, post_likePost_post, post_dislike_post, post_delete_recent } = require('../controllers/postController')

const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits:{ fileSize: 2 * 1024 * 1024} })
const s3Client = require('../../s3Client')
const multerS3 = require('multer-s3')
const { friendsRequest_accept_post, friendsDelete_post, friendReq_decline_post, friendRequest_send_by_name_post } = require('../controllers/friendsController')
const { comment_create_post, comments_load_get } = require('../controllers/commentController')

const s3Upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'odinbookkjai',
        metadata: function (req, file, cb) {
            
            cb(null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {
            cb(null, `videos/perm/${Date.now().toString()}${file.originalname}`)
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read'

    })
})

router.post('/user/create', create_user_post )

router.post('/user/login', user_login_post)

router.get('/auth/check', passport.authenticate('jwt', {session: false}), authenticateJwt )

router.delete('/auth/signOut', user_signOut_delete)

/* router.get('/auth/facebook', passport.authenticate('facebook', {session: false}), authenticateJwt ) */
//fb login using sdk instead of passport
router.post('/auth/facebook/login', user_login_facebook)


router.post('/image/temp/post', passport.authenticate('jwt', {session: false}), refreshJwt, upload.single('image'), image_temp_upload_post)

router.post('/post/create', passport.authenticate('jwt', {session: false}), refreshJwt, post_create_post)

router.get('/user/gsf', user_suggested_find)

router.post('/user/addfrd', passport.authenticate('jwt', {session: false}), refreshJwt, user_add_friend_req_post)

router.get('/user/friendrequests', passport.authenticate('jwt', {session: false}), refreshJwt, user_friendreq_get)

router.get('/user/updateFL', passport.authenticate('jwt', {session: false}), refreshJwt, user_fl_get)

router.post('/user/updatepfp', passport.authenticate('jwt', {session: false}), refreshJwt, upload.single('file'), user_pfp_change)

router.post('/user/savepfp', passport.authenticate('jwt', { session: false}), refreshJwt, user_pfp_save)

router.post('/post/create2', passport.authenticate('jwt', {session: false}), refreshJwt, s3Upload.single('video'), post_vid_create_post)

router.get('/vids/get', passport.authenticate('jwt', {session: false}), refreshJwt, video_posts_get)

router.get('/postsOnly/get', passport.authenticate('jwt', {session: false}), refreshJwt, postOnly_get)


router.post('/friends/accept', passport.authenticate('jwt', {session: false}), refreshJwt, friendsRequest_accept_post)

router.post('/friends/remove', passport.authenticate('jwt', {session: false}), refreshJwt, friendsDelete_post)

router.post('/friend/request/decline', passport.authenticate('jwt', {session: false}), refreshJwt, friendReq_decline_post)

router.post('/friend/request/add-by-name', passport.authenticate('jwt', {session: false}), refreshJwt, friendRequest_send_by_name_post)

router.get('/posts/timeline-get', passport.authenticate('jwt', {
    session: false
}), refreshJwt, postTimeline_get)

router.post('/post/likePost', passport.authenticate('jwt', {session: false}), refreshJwt, post_likePost_post)

router.post('/post/dislikePost',passport.authenticate('jwt', {session: false}), refreshJwt, post_dislike_post )

router.post('/comment/post', passport.authenticate('jwt', {session: false}), refreshJwt, comment_create_post)

router.get('/comments/get/', passport.authenticate('jwt', { session: false }), refreshJwt, comments_load_get)

router.post('/user/updateBio',passport.authenticate('jwt', { session: false }), refreshJwt, user_bio_update_post)

router.get('/user/getBio',passport.authenticate('jwt', { session: false }), refreshJwt, user_get_updatedBio)

router.get('/user/getPage/', user_getPage_get)

router.get('/user/getMore/', user_page_getMore)

router.post('/post/delete-recent', passport.authenticate('jwt', { session: false}), refreshJwt, post_delete_recent)

module.exports = router