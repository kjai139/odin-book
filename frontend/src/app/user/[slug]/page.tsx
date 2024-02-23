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
import { Post } from "../../../../interfaces/post.interface"
import UserpageFrdsTab from "@/app/_components/userpage/userFrdsTab"

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
    const [selectedTab, setSelectedTab] = useState<'post' | 'friends'>('post')
    const [recentPosts, setRecentPosts] = useState<Post[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [pagesDisplaying, setPagesDisplaying] = useState(1)
    

    const getPageInfo = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/getPage/?id=${params.slug}`)

            if (response.data.userInfo) {
                setUserInfo(response.data.userInfo)
                /* console.log(response.data.userInfo)
                console.log('recent activity:', response.data.recentPosts)
                console.log('totalpages', response.data.totalPages) */
                setRecentPosts(response.data.recentPosts)
                setTotalPages(response.data.totalPages)
                setPagesDisplaying(1)
            } else {
                notFound()
            }

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (selectedTab === 'post') {
            getPageInfo()
        }

    }, [selectedTab])

    const getMorePosts = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/getMore/?page=${pagesDisplaying + 1}&id=${params.slug}&curPage=${pagesDisplaying}`)

            if (response.data.newPage) {
                console.log('new page:', response.data.newPage)
                console.log('updatedTotalpgs:', response.data.totalPages)
                setTotalPages(response.data.totalPages)
                setPagesDisplaying(prev => prev + 1)
                setRecentPosts((prev) => [...prev, ...response.data.newPage])

            } else {
                console.log('no new pages')
            }


        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        console.log('RECENT POSTS:', recentPosts)
    }, [recentPosts])

    
    
    
    return (
        <>
        <div className="up-bg rounded shadow">
        <div className="userpg-bg">
        
            <div className="flex flex-col userpg-top-cont">
                <div className="userpf-cont">
                    <div className="d-img">

                    </div>
                    {/* <h1>USER DETAILS PAGE: {params.slug}</h1> */}
                </div>

                <div className="userpfp-outer flex border-b border-solid border-gray gap-2 pb-4">
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
                    <div className="up-pfp-txt">
                        <h1>{userInfo && userInfo.name ? formatUsername(userInfo.name) : 'Loading...'}</h1>
                    </div>
                    <div className="up-btn-wrap">
                            { userInfo && <UserAddFriend pgId={userInfo._id}></UserAddFriend>}
                    </div>
                </div>
                <div className="p-2">
                    <UserpageNav selected={selectedTab} selectTab={setSelectedTab}></UserpageNav>
                </div>
                
            
            </div>
        </div>
        </div>
        { selectedTab === 'post' &&
            <div className="up-content-cont py-4 px-2">
            {recentPosts && userInfo && <UserPostTab bio={userInfo && userInfo.bio && JSON.parse(userInfo.bio)} recentPosts={recentPosts}></UserPostTab>}
        { selectedTab === 'post' && recentPosts && recentPosts.length > 0 && totalPages > pagesDisplaying &&
            <InfiScroll loadMore={getMorePosts}></InfiScroll>
            }
        </div>}
        { selectedTab === 'friends' &&
        <div className="up-content-cont py-4 px-2">
            <UserpageFrdsTab pageUserId={params.slug}></UserpageFrdsTab>

        </div>
        }
        </>
    )
}