const { PutObjectCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()
const crypto = require('crypto')
const multer = require('multer')
const debug = require('debug')('odin-book:imageController')

const s3Client = require('../../s3Client')

const generateRandomString = (len) => {
    const timestamp = Date.now()
    return `${crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len)}${timestamp}`
}



exports.image_temp_upload_post = async (req, res) => {
    debug('req.file', req.file)
    try {
        const imageFileName = req.file.originalname.replace(/ /g, '_')
        const bucketName = 'odinbookkjai'
        const s3randomString = generateRandomString(5)

        const params = {
            Bucket: bucketName,
            Key: `images/temp/${s3randomString}_${imageFileName}`,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)
        const response = await s3Client.send(command)

        res.json({
            success: true,
            message: `image uploaded successfully. URL:https://${bucketName}.s3.us-east-2.amazonaws.com/${params.Key}`,
            url:`https://${bucketName}.s3.us-east-2.amazonaws.com/${params.Key}`

        })
        


    } catch (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(413).json({
                    message: 'File size exceeds limit of 2MB'
                })
            } else {
                res.status(413).json({
                    message: 'Internal multer error'
                })
            }
        } else {
            res.status(500).json({
                message: err.message
            })
        }
    }
}