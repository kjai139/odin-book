import { io } from 'socket.io-client'

//same domain

let url

if (process.env.NODE_ENV === 'production') {
    url = ''
} else {
    url = 'http://localhost:4000'
}

let socketInstance

const initializeSocket = () => {
    if (!socketInstance) {
        console.log('socket initializing...')
        socketInstance = io(url)
    }
    return socketInstance
}

export default initializeSocket