'use client'
import { useEffect, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import { addFriend } from "@/app/_utils/friends"
import axiosInstance from '../../../../axios'

interface UserAddFriendProps {
    pgId: string
}


export default function UserAddFriend({pgId}:UserAddFriendProps) {

    const { user, isAuthenticated } = useAuth()
    const [resultMsg, setResultMsg] = useState()

    const handleAddFriend = async (id:string, userId:string) => {
        const response = await addFriend(id, userId)

        if (response?.data.success) {
            console.log(response.data.message)
            setResultMsg(response.data.message)
        } else {
            
            console.log(response?.data.message)
            if (typeof response.data.message !== 'string'){
                setResultMsg(response?.data.message.response.data)
            } else {
                setResultMsg(response?.data.message)
            }
            
        }

    }

   
    

    useEffect(() => {
        isAuthenticated()
        
    }, [])

    return (
        <>
        <div className="flex gap-2 ">
            { user && 
            <>
            <button className="up-btns">Message</button>
            { user._id !== pgId && !user.friendlist.includes(pgId) &&
                <button className="up-btns" onClick={() => handleAddFriend(user._id, pgId)}>Add friend</button>}
            {/* {user._id !== pgId  && user.friendlist.includes(pgId) &&
            <button className="up-btns">Remove friend</button>
            } */}
            </>
            }
            
        </div>
        </>
    )
}