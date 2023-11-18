'use client'

import { useEffect } from "react"
import { useAuth } from "../../../context/authContext"
import { useRouter } from "next/navigation"



import DashboardHeader from "../_components/dashboardHeader"
import DashboardLeftSideBar from "../_components/dbLeftSideBar"


export default function Dashboard () {

    const { user, isAuthenticated, signOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
        isAuthenticated()

        
    }, [])

    useEffect(() => {
        console.log('user updated -', user)
    }, [user])





    
    return (
        <div className="h-screen w-screen flex flex-col">
            <DashboardHeader></DashboardHeader>
            <div className="bc relative">
                <div className="db-g-cont">
                    <DashboardLeftSideBar></DashboardLeftSideBar>
                </div>
            </div>
            
        </div>
        
    )
}