'use client'
import { useEffect } from "react"
import { useAuth } from "../../../../context/authContext"

interface UserAddFriendProps {
    pgId: string
}


export default function UserAddFriend({pgId}:UserAddFriendProps) {

    const { user, isAuthenticated } = useAuth()
    

    useEffect(() => {
        isAuthenticated()
        
    }, [])

    return (
        <>
        <div className="flex gap-2 ">
            { user && 
            <>
            <button className="up-btns">Message</button>
            <button className="up-btns">{user._id !== pgId && !user.friendlist.includes(pgId) ? 'Add Friend' : 'Remove friend'}</button>
            </>
            }
            
        </div>
        </>
    )
}