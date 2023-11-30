require('dotenv').config()
const { S3Client } = require('@aws-sdk/client-s3')


const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
})

module.exports = s3Client