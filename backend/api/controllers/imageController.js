const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()
const crypto = require('crypto')
const multer = require('multer')

const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
})

const generateRandomString = (len) => {
    const timestamp = Date.now()
    return `${crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len)} + ${timestamp}`
}



exports.image_temp_upload_post = async (req, res) => {
    try {
        const imageFileName = req.file.originalname.replace(/ /g, '_')
        const bucketName = 'odinbookkjai'
        const s3KeyName = generateRandomString(5)

        const params = {
            Bucket: bucketName,
            Key: `/temp/${imageFileName}_${s3KeyName}`,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: 'image/x-icon'
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
                message: err
            })
        }
    }
}