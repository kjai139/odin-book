import { useEffect, useState } from "react"
import { User, useAuth } from "../../../../context/authContext"
import { IoHappyOutline } from 'react-icons/io5'
import axiosInstance from '../../../../axios'
import { useRouter } from "next/navigation"
import { formatUsername } from "@/app/_utils/formatStrings"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"

export default function FriendRequest () {

    const [pendingFrdReq, setPendingFrdReq] = useState<User[]>([])
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    const { isAuthenticated, user } = useAuth()
    const router = useRouter()

    const getPopulatedFrdReq = async (userId:string) => {
        try {
            const response = await axiosInstance.get(`/api/user/friendrequests?get=${userId}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setPendingFrdReq(response.data.newUser.friendReq)
                setIsDataLoaded(true)
                console.log('Friend requests updated.')
            } 
        } catch (err:any) {
            setIsDataLoaded(true)
            console.error('Error getting friend requests', err)
            if (err.response.status === 401) {
                router.push('/')
            }
        }
    }

    useEffect(() => {
        if (user) {
            console.log('friend requests updated, getting populated ver...')
            getPopulatedFrdReq(user._id)
        }

    }, [user])

    return (
        <div className="mt-8 flex flex-col gap-4">
            { pendingFrdReq && pendingFrdReq.length > 0 && 
            <h3>Pending friend requests</h3>
            }
            { pendingFrdReq && pendingFrdReq.length > 0 && pendingFrdReq.map((node) => {
                return (
                    <div key={node._id} className="flex justify-between bg-white p-4 rounded shadow items-center">
                        <div className="flex gap-2">
                            <div className="w-8 h-8">
                            {node.image ?
                            <Image src={node.image} alt="user profile picture"></Image> : 
                            <UserPortrait></UserPortrait>
                            }
                            </div>
                        
                            <h3>{formatUsername(node.name)}</h3>
                        </div>
                        <div className="flex gap-4">
                            <button>Accept</button>
                            <button>Decline</button>
                        </div>
                        
                    </div>
                )
            }) }
            {
                isDataLoaded && pendingFrdReq && pendingFrdReq.length === 0 && 
                <div className="flex flex-col gap-4">
                
                <div className="flex justify-center">
                <IoHappyOutline size={140}></IoHappyOutline>
                </div>
                <h3 className="text-center">You have no pending friend requests...</h3>
                </div> 
            }
            
            

        </div>
    )
}