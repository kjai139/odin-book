
const { Server } = require('socket.io')
const { createServer } = require('http')
const debug = require('debug')('odin-book:socket')

let origin
if (process.env.NODE_ENV === 'production') {
    origin = ''
} else {
    origin = 'http://localhost:3000'
}

const initSocket = (server) => {
    
    const io = new Server(server, {
        cors: {
            origin: origin,
            credentials: true,

        }
    })
    
    io.on('connection', (socket) => {
        if (socket.recovered) {
            debug('user recovered', socket.id)
            debug('rooms:', socket.rooms)
            debug('socket data', socket.data)
        } else {
            debug('new connection:', socket.id)
        }
    })

    io.on('disconnect', (socket) => {
        debug(`user ${socket.id} has disconnected`)
    })

    

    
}

module.exports = {initSocket}