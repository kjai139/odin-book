'use client'
import DashboardLeftSideBar from "@/app/_components/dbLeftSideBar";
import FriendRequest from "@/app/_components/friends/requests";
import SuggestedFriends from "@/app/_components/suggestedFriends";
import { useState } from "react";


export default function DashboardFriends() {

    const [displaying, setDisplaying] = useState(0)

    interface DisplayingMapping {
        [key: number] : React.ReactNode
    }

    const displayingMap:DisplayingMapping = {
        0: null,
        1: null,
        2: <FriendRequest></FriendRequest>,
        3:<SuggestedFriends></SuggestedFriends>,
    }

    return (
        <>
            <DashboardLeftSideBar selectTab={setDisplaying}></DashboardLeftSideBar>
            
            {displayingMap[displaying]}
            
        </>
    )
}