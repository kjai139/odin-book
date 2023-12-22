import { User, useAuth } from "../../../context/authContext"
import axiosInstance from '../../../axios'
import { useEffect, useState } from "react"
import Image from "next/image"
import { UserPortrait } from "./SVGRComponent"
import { formatUsername } from "../_utils/formatStrings"
import { addFriend } from "../_utils/friends"
import ResultModal from "../_modals/resultModal"


export default function SuggestedFriends() {

    const { user } = useAuth()

    const [suggestedFrds, setSuggestedFrds] = useState<User[]>()
    const [resultMsg, setResultMsg] = useState('')

    const getSuggestedFrds = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/gsf?id=${user && user._id}`, {
                withCredentials: true
            })

            console.log(response.data.suggestedFrds)
            setSuggestedFrds(response.data.suggestedFrds)
        } catch (err) {
            console.log('error in suggested', err)
        }
    }

    useEffect(() => {
        getSuggestedFrds()
    }, [])

    const handleAddFriend = async (id:string, userId:string) => {
        const response = await addFriend(id, userId)

        if (response?.data.success) {
            console.log(response.data.message)
            setResultMsg(response.data.message)
        } else {
            console.log(response?.data.message)
            setResultMsg(response?.data.message)
        }

    }



    return (
        <div className="flex flex-col gap-4 mt-8">
            {resultMsg && <ResultModal resultMsg={resultMsg} closeModal={() => setResultMsg('')}></ResultModal>}
        <h2>Make some friends</h2>
        <div className="suggest-grid">
            
            {user && suggestedFrds && suggestedFrds.map((node) => {
                return (
                    <div key={node._id} className="p-4 rounded shadow flex flex-col gap-2 bg-white">
                        <div className="suggest-img-cont relative flex-1">
                        {node.image ? <Image src={node.image} alt='user picture' fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image> : 
                        <UserPortrait></UserPortrait>
                        }
                        </div>
                        <span className="font-bold">{formatUsername(node.name)}</span>
                        <div className="flex flex-col gap-1 mt-auto">
                            <button onClick={() => handleAddFriend(node._id, user._id)} className="suggest-af-btn rounded p-1">Add Friend</button>
                            <button className="suggest-v-btn">View</button>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
    )
}