const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()

const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
})



exports.image_temp_upload_post = async (req, res) => {

}