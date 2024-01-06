import { useEffect, useState } from "react"
import { FaRegSadCry } from "react-icons/fa"
import axiosInstance from '../../../../axios'
import { useAuth } from "../../../../context/authContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"
import { formatUsername } from "@/app/_utils/formatStrings"
import PromptModal from "@/app/_modals/promptModal"

export default function YourFriends () {

    const [displayingFriendlist, setDisplayingFriendlist] = useState<User[]>([])
    const { user } = useAuth()
    const router = useRouter()
    const [isDoneLoading, setIsDoneLoading] = useState(false)
    const [isPromptOpen, setIsPromptOpen] = useState(false)
    const [promptingId, setPromptingId] = useState('')
    // the frd id for removal
    const [promptMsg, setPromptMsg] = useState('')

    const getPopulatedFL = async (id:string) => {
        try {
            setIsDoneLoading(false)
            const response = await axiosInstance.get(`/api/user/updateFL?get=${id}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setDisplayingFriendlist(response.data.newUser.friendlist)
                setIsDoneLoading(true)
            }
        } catch (err:any) {
            setIsDoneLoading(true)
            console.error(err)
            if (err.response.status === 401) {
                router.push('/')
            }
        }
    }

    const removeFriend = async (id:string) => {
        try {
            const response = await axiosInstance.post('/api/friends/remove', {
                friendId: id
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                setDisplayingFriendlist(response.data.updatedFrds)
                console.log(`friend ${id} removed`)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const startPromptRemoveFrd = (promptId:string, promptName: string) => {
        setIsPromptOpen(true)
        setPromptingId(promptId)
        setPromptMsg(`Are you sure you want to remove ${formatUsername(promptName)} from your friendlist?`)

    }

    useEffect(() => {
        if (user) {
            getPopulatedFL(user._id)
        }
    }, [user])



    return (
        <div className="mt-8 flex flex-col gap-4">
            {isPromptOpen &&
            <PromptModal agreeFunc={() => removeFriend(promptingId)} closeModal={() => setIsPromptOpen(false)} promptMsg={promptMsg}></PromptModal> 
            }
            { isDoneLoading && displayingFriendlist && displayingFriendlist.length > 0 ? displayingFriendlist.map((node) => {
                return (
                    <div key={node._id} className="flex justify-between bg-white p-4 rounded shadow items-center">
                        <div className="flex gap-2">
                            <div className="w-8 h-8 relative rounded-full overflow-hidden">
                            {node.image ?
                            <Image src={node.image} alt="user profile picture" fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image> : 
                            <UserPortrait></UserPortrait>
                            }
                            </div>
                        
                            <h3>{formatUsername(node.name)}</h3>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => startPromptRemoveFrd(node._id, node.name)}>Remove Friend</button>
                            
                        </div>
                        
                    </div>
                )
            }): isDoneLoading && displayingFriendlist.length < 1 &&
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