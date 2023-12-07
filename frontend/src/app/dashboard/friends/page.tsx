'use client'
import DashboardLeftSideBar from "@/app/_components/dbLeftSideBar";
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
        2: null,
        3:<SuggestedFriends></SuggestedFriends>,
    }

    return (
        <>
            <DashboardLeftSideBar selectTab={setDisplaying}></DashboardLeftSideBar>
            
            {displayingMap[displaying]}
            
        </>
    )
}