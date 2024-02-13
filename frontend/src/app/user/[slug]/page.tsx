'use client'
import { User } from "../../../../interfaces/user.interface"

import { notFound } from "next/navigation"
import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatUsername } from "@/app/_utils/formatStrings"
import UserAddFriend from "@/app/_components/buttons/userAddFrd"
import UserpageNav from "@/app/_components/userpage/userpageNav"
import axiosInstance from '../../../../axios'
import { useEffect, useRef, useState } from "react"
import UserPostTab from "@/app/_components/userpage/userPostTab"
import InfiScroll from "@/app/_components/scroll/infiscroll"

/* async function fetchUser(id) {
    const res = await fetch(`http://localhost:4000/api/user/getPage/?id=${id}`)
    if (!res.ok) return undefined
    return res.json()
} */

// SSR fetch


export default function UserDetails({ params }) {

    /* const user = await fetchUser(params.slug)
    console.log(params.slug)

    if (!user) {
        notFound()
    } else {
        console.log('USER:', user.userInfo)
    } */

    const [userInfo, setUserInfo] = useState<User>()
    const [selectedTab, setSelectedTab] = useState('post')
    const [recentPosts, setRecentPosts] = useState([])
    const [totalPages, setTotalPages] = useState()
    const [pageDisplaying, setPageDisplaying] = useState(1)
    

    const getPageInfo = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/getPage/?id=${params.slug}`)

            if (response.data.userInfo) {
                setUserInfo(response.data.userInfo)
                console.log(response.data.userInfo)
                console.log('recent activity:', response.data.recentPosts)
                console.log('totalpages', response.data.totalPages)
                setRecentPosts(response.data.recentPosts)
                setTotalPages(response.data.totalPages)
            } else {
                notFound()
            }

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getPageInfo()
    }, [])

    const getMorePosts = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/getMore/?page=${pageDisplaying + 1}`)

            if (response.data.newPage) {

            }


        } catch (err) {
            console.error(err)
        }
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
                            {userInfo?.image ?
                            <Image src={userInfo.image} width={125} height={125} alt="user profile picture" priority></Image> :
                            <BsPersonCircle className="backup-user-img" size={125}></BsPersonCircle> 
                            }
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>{userInfo && userInfo.name ? formatUsername(userInfo.name) : 'Loading...'}</h1>
                    </div>
                    <div className="up-btn-wrap">
                            <UserAddFriend pgId={userInfo?._id}></UserAddFriend>
                    </div>
                </div>
                <div className="p-2">
                    <UserpageNav selected={selectedTab}></UserpageNav>
                </div>
                
            
            </div>
        </div>
        </div>
        <div className="up-content-cont py-4 px-2">
            <UserPostTab bio={userInfo && JSON.parse(userInfo.bio)} recentPosts={recentPosts}></UserPostTab>
        <InfiScroll loadMore={() => console.log('loading more...')}></InfiScroll>
        </div>
        </>
    )
}