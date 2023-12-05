'use client'
import DashboardLeftSideBar from "@/app/_components/dbLeftSideBar";
import { useState } from "react";


export default function DashboardFriends() {

    const [displaying, setDisplaying] = useState(0)

    interface DisplayingMapping {
        [key: number] : React.ReactNode
    }

    const displayingMap:DisplayingMapping = {
        0: null,
        1: null,
        2: null
    }

    return (
        <>
            <DashboardLeftSideBar selectTab={setDisplaying}></DashboardLeftSideBar>
            {displayingMap[displaying]}
        </>
    )
}