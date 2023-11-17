'use client'

import { useEffect } from "react"
import { useAuth } from "../../../context/authContext"
import { useRouter } from "next/navigation"


import FriendsIcon from '../_components/icons/friends.svg'
import HomeIcon from '../_components/icons/home.svg'
import GroupIcon from '../_components/icons/group.svg'

import UserPortrait from '../_components/icons/userPortrait.svg'
import DashboardHeader from "../_components/dashboardHeader"


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
                    
                </div>
            </div>
            
        </div>
        
    )
}