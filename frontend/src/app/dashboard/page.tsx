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


    interface ContentMapping {
        [key: number] : React.ReactNode
    }

   const contentMapping: ContentMapping = {
        0:<UserPosts></UserPosts>,
        1: null,
        2: null,
   }





    
    return (
        <>
            <DashboardLeftSideBar selectTab={setDisplaying}></DashboardLeftSideBar>
            {contentMapping[displaying]}
        </>
               
        
    )
}