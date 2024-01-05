const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000
const mongodb = process.env.MONGO_DB 
const mongoose = require('mongoose')
const cors = require('cors')
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
const passport = require('../passport')
const cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const { createServer } = require('http')
const apiRouter = require('./routes/api')
const { initSocket } = require('./socket')
const debug = require('debug')('odin-book:server')

const httpServer = createServer(app)
initSocket(httpServer)

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


httpServer.listen(port, () => {
    console.log(`server running on ${port}`)
})