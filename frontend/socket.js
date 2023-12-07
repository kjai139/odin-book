import { io } from 'socket.io-client'

//same domain

let url

if (process.env.NODE_ENV === 'production') {
    url = ''
} else {
    url = 'http://localhost:4000'
}

const socket = io(url)

export default socket