
const { Server } = require('socket.io')
const { createServer } = require('http')
const debug = require('debug')('odin-book:socket')

let origin
if (process.env.NODE_ENV === 'production') {
    origin = ''
} else {
    origin = ['http://localhost:3000', 'http://localhost:3001']
}

module.exports = (server) => {
    
    const io = new Server(server, {
        cors: {
            origin: origin,
            credentials: true,

        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
        }
    })
    
    io.on('connection', (socket) => {
      
        if (socket.recovered) {
            debug('user recovered', socket.id)
            debug('rooms:', socket.rooms)
            debug('socket data', socket.data)
        } else {
            debug('new connection:', socket.id)
            debug('rooms:', socket.rooms)
        }

        socket.on('joinRoom', (id) => {
            socket.join(id)
            debug(`user ${id} has joinned their room.`)
            debug('rooms:', socket.rooms)
            io.to(id).emit('message', `User ${id} has entered the room`)
            
        })



        socket.on('disconnect', () => {
            debug(`user ${socket.id} has disconnected`)
            debug('roomsize:', socket.rooms.size)
        })
    })

    

    

    
    module.exports.io = io
    
}

