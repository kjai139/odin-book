'use client'


import { useEffect } from "react"
import DashboardHeader from "../_components/dashboardHeader"
import { useAuth } from "../../../context/authContext"
import { io } from 'socket.io-client'
import HomeFooter from "../_components/homeFooter"


export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const { isAuthenticated, user, setUser } = useAuth()

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

            socket.on('incFrdReq', (data) => {
                console.log('Friend request came from:', data.updatedFrdReq)
                setUser((prev:any) => ({
                    ...prev,
                    friendReq: data.updatedFrdReq
                }))
            })

            socket.on('frdRemoved', (data) => {
                console.log(`A friend was removed.`)
                setUser((prev:any) => ({
                    ...prev,
                    friendlist: data.updatedFriendlist
                }))
            })
            return () => {
                socket.disconnect()
                console.log('socket disconnected from cleanup.')
            }
        }

    

    }, [user])

    

    return (
        <div className="h-screen w-full flex flex-col">
            <DashboardHeader></DashboardHeader>
            <div className="bc relative">
                <div className="db-g-cont gap-10">
                    {children}
                </div>
            </div>
            <HomeFooter></HomeFooter>
            
            
        </div>
    )
}