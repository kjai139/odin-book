'use client'


import { useEffect } from "react"
import DashboardHeader from "../_components/dashboardHeader"
import { useAuth } from "../../../context/authContext"
import socket from "../../../socket"



export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const { user, isAuthenticated, signOut, pathname } = useAuth()

    useEffect(() => {
        isAuthenticated()
    },[pathname])

    useEffect(() => {
        if (user) {
            if (!socket.connected){
                console.log('socket not connected, connecting manually...')
                socket.connect()
            }

            socket.on('connect', async () => {
                console.log(`user ${socket.id} has connected`)
                //using acknowledge promise
                try {
                    const response = await socket.emitWithAck('joinRoom', user._id)

                    if (response.success) {
                        console.log(`User has joinned room ${user._id} in socket`)
                    }
                } catch(err) {
                    console.log('Socket error:', err)
                }
                
                
            })
        }

        return () => {
            socket.disconnect()
            console.log('socket disconnected from cleanup.')
        }

    }, [user])

    return (
        <div className="h-screen w-screen flex flex-col">
            <DashboardHeader></DashboardHeader>
            <div className="bc relative">
                <div className="db-g-cont">
                    {children}
                </div>
            </div>
            
        </div>
    )
}