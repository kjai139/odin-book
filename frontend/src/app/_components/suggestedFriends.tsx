import { useAuth } from "../../../context/authContext"
import axiosInstance from '../../../axios'
import { useEffect, useState } from "react"


export default function SuggestedFriends() {

    const { user } = useAuth()

    const [suggestedFrds, setSuggestedFrds] = useState(null)

    const getSuggestedFrds = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/gsf?id=${user && user._id}`, {
                withCredentials: true
            })

            console.log(response.data.suggestedFrds)
        } catch (err) {
            console.log('error in suggested', err)
        }
    }

    useEffect(() => {
        getSuggestedFrds()
    }, [])



    return (
        <div>
            
        </div>
    )
}