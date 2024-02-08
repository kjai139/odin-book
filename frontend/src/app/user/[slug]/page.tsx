
import { User } from "../../../../interfaces/user.interface"

import { notFound } from "next/navigation"
import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatUsername } from "@/app/_utils/formatStrings"
import UserAddFriend from "@/app/_components/buttons/userAddFrd"
import UserpageNav from "@/app/_components/userpage/userpageNav"

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
                    <div className="d-img">

                    </div>
                    {/* <h1>USER DETAILS PAGE: {params.slug}</h1> */}
                </div>

                <div className="flex border-b border-solid border-gray gap-2 pb-4">
                    <div className="rounded-full bg-white p-2 border-2 border-solid border-white relative pfp-mask-cont">
                        <div className="pfp-mask">
                            <div className="rounded-full overflow-hidden pfp-img-div">
                            {user.userInfo.image ?
                            <Image src={user.userInfo.image} width={125} height={125} alt="user profile picture" priority></Image> :
                            <BsPersonCircle className="backup-user-img" size={125}></BsPersonCircle> 
                            }
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>{formatUsername(user.userInfo.name)}</h1>
                    </div>
                    <div className="up-btn-wrap">
                            <UserAddFriend pgId={user.userInfo._id}></UserAddFriend>
                    </div>
                </div>
                <div>
                    <UserpageNav></UserpageNav>
                </div>
                
            
            </div>
        </div>
        </div>
        <div className="up-content-cont">

        </div>
        </>
    )
}