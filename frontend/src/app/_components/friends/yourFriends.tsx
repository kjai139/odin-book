import { useEffect, useState } from "react"
import { FaRegSadCry } from "react-icons/fa"
import axiosInstance from '../../../../axios'
import { User, useAuth } from "../../../../context/authContext"
import { useRouter } from "next/navigation"

export default function YourFriends () {

    const [displayingFriendlist, setDisplayingFriendlist] = useState<User[]>([])
    const { user } = useAuth()
    const router = useRouter()

    const getPopulatedFL = async (id:string) => {
        try {
            const response = await axiosInstance.get(`/api/user/updateFL?get=${id}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setDisplayingFriendlist(response.data.newUser.friendlist)
            }
        } catch (err:any) {
            console.error(err)
            if (err.response.status === 401) {
                router.push('/')
            }
        }
    }

    useEffect(() => {
        if (user) {
            getPopulatedFL(user._id)
        }
    }, [user])



    return (
        <div>
            { displayingFriendlist && displayingFriendlist.length > 0 ? displayingFriendlist.map((node) => {
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
                <h3 className="text-center">You have no friends yet...</h3>
            </div> 
            }

        </div>
    )
}