import { useEffect, useState } from "react"
import { useAuth } from "../../../../context/authContext"


export default function FriendRequest () {

    const [pendingFrdReq, setPendingFrdReq] = useState<string[]>([])

    const { isAuthenticated, user } = useAuth()

    useEffect(() => {
        isAuthenticated()
    }, [])

    useEffect(() => {
        if (user) {
            setPendingFrdReq(user.friendReq)
            console.log('friend requests updated')
        }

    }, [user])

    return (
        <div>
            Friend requests page

        </div>
    )
}