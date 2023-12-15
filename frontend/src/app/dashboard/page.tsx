'use client'

import { useEffect, useState } from "react"
import { useAuth } from "../../../context/authContext"
import { useRouter } from "next/navigation"



import DashboardHeader from "../_components/dashboardHeader"
import DashboardLeftSideBar from "../_components/dbLeftSideBar"
import UserPosts from "../_components/userPosts"
import UserTab from "../_components/home/userTab"
import { io } from 'socket.io-client'


export default function Dashboard () {

    const { user, isAuthenticated, signOut } = useAuth()
    const router = useRouter()
    const [displaying, setDisplaying] = useState<number>(0)
    


    interface ContentMapping {
        [key: number] : React.ReactNode
    }

   const contentMapping: ContentMapping = {
        0:null,
        1: <UserTab></UserTab>,
        2: <UserPosts></UserPosts>,
        3: null,
   }







    
    return (
        <>
            <DashboardLeftSideBar selectTab={setDisplaying}></DashboardLeftSideBar>
            {contentMapping[displaying]}
        </>
               
        
    )
}