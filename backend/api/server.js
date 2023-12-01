const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000
const mongodb = process.env.MONGO_DB 
const mongoose = require('mongoose')
const cors = require('cors')
const allowedOrigins = ['http://localhost:3000']
const passport = require('../passport')
const cookieParser = require('cookie-parser')

const apiRouter = require('./routes/api')

const main = async () => {
    try {
        mongoose.connect(mongodb)
        console.log('mongodb connected')
    } catch (err) {
        console.log(err)
    }
}

main()

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
/* app.use(express.urlencoded({extended: false})) */
app.use(passport.initialize())
app.use('/api', apiRouter)


app.listen(port, () => {
    console.log(`server running on ${port}`)
})