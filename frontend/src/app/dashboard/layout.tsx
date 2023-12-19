'use client'


import { useEffect } from "react"
import DashboardHeader from "../_components/dashboardHeader"
import { useAuth } from "../../../context/authContext"
import { io } from 'socket.io-client'



export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const { isAuthenticated, user } = useAuth()

    let url:string

    if (process.env.NODE_ENV === 'production') {
        url = ''
    } else {
        url = 'http://localhost:4000'
    }

    
    

    useEffect(() => {
        isAuthenticated()
    },[])

    /* useEffect(() => {
        return () => {
            socket.disconnect()
            console.log('SOCKET DISCONNECTED FROM UF11')
        }
   }, []) */

   useEffect(() => {
        if (user) {
            const socket = io(url)
            console.log('current Id = ', user._id)
            /* if (!socket.connected){
                console.log('socket not connected, connecting manually...')
                socket.connect()
            } */

            socket.on('connect', async () => {
                console.log(`user ${socket.id} has connected`)
                
                socket.emit('joinRoom', user._id)
                
                
            })

            socket.on('message', (msg) => {
                console.log('Msg from server:', msg)
            })
            return () => {
                socket.disconnect()
                console.log('socket disconnected from cleanup.')
            }
        }

    

    }, [user])

    

    return (
        <div className="h-screen w-screen flex flex-col">
            <DashboardHeader></DashboardHeader>
            <div className="bc relative">
                <div className="db-g-cont gap-10">
                    {children}
                </div>
            </div>
            
            
        </div>
    )
}