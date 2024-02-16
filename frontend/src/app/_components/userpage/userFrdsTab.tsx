import { useEffect, useState } from 'react'
import axiosInstance from '../../../../axios'
import { UserPortrait } from '../SVGRComponent'
import Image from 'next/image'
import { formatUsername } from '@/app/_utils/formatStrings'
import { User } from '../../../../interfaces/user.interface'
import { useRouter } from 'next/navigation'

interface UserpageFrdsTabProps {
    pageUserId: string
}

export default function UserpageFrdsTab ({pageUserId}:UserpageFrdsTabProps) {

    const router = useRouter()

    const [userFrds, setuserFrds] = useState<User[]>([])

    const getUserFriends = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/updateFL?get=${pageUserId}`, {
                withCredentials: true
            })

            if (response.data.newUser) {
                setuserFrds(response.data.newUser.friendlist)
            }

        } catch (err:any) {
            console.error(err)
            if (err.response && err.response.status === 401) {
                router.push('/')
            }
        }
    }

    const viewUserPage = (id:string) => {
        router.push(`/user/${id}`)
    }

    useEffect(() => {
        getUserFriends()
    }, [])


    return (
        <div>
             <div className="suggest-grid">
            
            {userFrds && userFrds.map((node) => {
                return (
                    <div key={node._id} className="p-4 rounded shadow flex flex-col gap-2 bg-white">
                        <div className="suggest-img-cont relative flex-1">
                        {node.image ? <Image src={node.image} alt='user picture' width={100} height={100} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{
                            width:'100%',
                            height: '100%'
                        }}></Image> : 
                        <UserPortrait></UserPortrait>
                        }
                        </div>
                        <span className="font-bold">{formatUsername(node.name)}</span>
                        <div className="flex flex-col gap-1 mt-auto">
                            
                            <button className="suggest-v-btn" onClick={() => viewUserPage(node._id)}>View</button>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
    )
}