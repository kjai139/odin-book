
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
    
    io.on('connection', async (socket) => {
        const sockets = await io.fetchSockets()
        console.log(sockets.length)
        if (socket.recovered) {
            debug('user recovered', socket.id)
            debug('rooms:', socket.rooms)
            debug('socket data', socket.data)
        } else {
            debug('new connection:', socket.id)
            debug('rooms:', socket.rooms)
        }

        socket.on('joinRoom', (id, ackCB) => {
            socket.join(id)
            debug(`user ${id} has joinned their room.`)
            debug('rooms:', socket.rooms)
            ackCB({
                success: true
            })
        })



        socket.on('disconnect', () => {
            debug(`user ${socket.id} has disconnected`)
            debug('roomsize:', socket.rooms.size)
        })
    })

    

    

    

    
}

module.exports = {initSocket}