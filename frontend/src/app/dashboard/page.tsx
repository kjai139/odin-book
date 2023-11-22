'use client'

import { useEffect, useState } from "react"
import { useAuth } from "../../../context/authContext"
import { useRouter } from "next/navigation"



import DashboardHeader from "../_components/dashboardHeader"
import DashboardLeftSideBar from "../_components/dbLeftSideBar"
import UserPosts from "../_components/userPosts"


export default function Dashboard () {

    const { user, isAuthenticated, signOut } = useAuth()
    const router = useRouter()
    const [displaying, setDisplaying] = useState<number>(0)

    useEffect(() => {
        isAuthenticated()

        
    }, [])

    useEffect(() => {
        console.log('user updated -', user)
    }, [user])

    interface ContentMapping {
        [key: number] : React.ReactNode
    }

   const contentMapping: ContentMapping = {
        0:<div>No content</div>,
        1: null,
        2: <UserPosts></UserPosts>
   }





    
    return (
        <div className="h-screen w-screen flex flex-col">
            <DashboardHeader></DashboardHeader>
            <div className="bc relative">
                <div className="db-g-cont">
                    <DashboardLeftSideBar selectTab={setDisplaying}></DashboardLeftSideBar>
                    {contentMapping[displaying]}
                </div>
            </div>
            
        </div>
        
    )
}