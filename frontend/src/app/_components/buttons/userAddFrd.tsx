'use client'
import { useAuth } from "../../../../context/authContext"

interface UserAddFriendProps {
    pgId: string
}


export default function UserAddFriend({pgId}:UserAddFriendProps) {

    const { user } = useAuth()

    return (
        <>
        <div className="flex gap-2 ">
            { user ? <button className="up-btns">{user._id !== pgId && user.friendlist.includes(pgId) && 'Add Friend'}</button> :
            <button className="up-btns">Add Friend</button>
            }
            <button className="up-btns">Follow</button>
        </div>
        </>
    )
}