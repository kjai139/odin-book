
import { User } from "../../../../interfaces/user.interface"

import { notFound } from "next/navigation"
import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatUsername } from "@/app/_utils/formatStrings"

async function fetchUser(id) {
    const res = await fetch(`http://localhost:4000/api/user/getPage/?id=${id}`)
    if (!res.ok) return undefined
    return res.json()
}


export default async function UserDetails({ params }) {

    const user = await fetchUser(params.slug)
    console.log(params.slug)

    if (!user) {
        notFound()
    } else {
        console.log('USER:', user.userInfo)
    }
    
    
    return (
        <>
        <div className="up-bg rounded shadow">
        <div className="userpg-bg">
        
            <div className="flex flex-col">
                <div className="userpf-cont">
                    <h1>USER DETAILS PAGE: {params.slug}</h1>
                </div>

                <div className="flex border-b border-solid border-gray">
                    <div className="rounded-full bg-white p-2 border-2 border-solid border-white">
                        <div className="pfp-mask">
                            <div className="rounded-full overflow-hidden w-125 h-125">
                            {user.userInfo.image ?
                            <Image src={user.userInfo.image} width={125} height={125} alt="user profile picture"></Image> :
                            <BsPersonCircle className="backup-user-img" size={125}></BsPersonCircle> 
                            }
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>{formatUsername(user.userInfo.name)}</h1>
                    </div>
                </div>
                <div>
                    <button>Post</button>
                </div>
                
            
            </div>
        </div>
        </div>
        <div className="up-content-cont">

        </div>
        </>
    )
}