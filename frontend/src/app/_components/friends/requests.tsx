import { useEffect, useState } from "react"
import { User, useAuth } from "../../../../context/authContext"
import { FaRegSadCry } from 'react-icons/fa'
import axiosInstance from '../../../../axios'

export default function FriendRequest () {

    const [pendingFrdReq, setPendingFrdReq] = useState<User[]>([])

    const { isAuthenticated, user } = useAuth()

    const getPopulatedFrdReq = async (userId:string) => {
        try {
            const response = await axiosInstance.get(`/api/user/friendrequests?get=${userId}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setPendingFrdReq(response.data.newUser.friendReq)
                console.log('Friend requests updated.')
            } else {
                console.log('Not logged in, rerouting...')
            }
        } catch (err) {
            console.error('Error getting friend requests', err)
        }
    }

    useEffect(() => {
        if (user) {
            console.log('friend requests updated, getting populated ver...')
            getPopulatedFrdReq(user._id)
        }

    }, [user])

    return (
        <div>
            { pendingFrdReq && pendingFrdReq.length > 0 ? pendingFrdReq.map((node) => {
                return (
                    <div key={node._id}>
                        <p>{node.name}</p>
                    </div>
                )
            }):
            <div className="flex flex-col mt-8 gap-4">
                
                <div className="flex justify-center">
                <FaRegSadCry size={140}></FaRegSadCry>
                </div>
                <h2 className="text-center">You have no pending friend requests...</h2>
            </div> 
            }

        </div>
    )
}