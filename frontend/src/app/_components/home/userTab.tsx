import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"
import axiosInstance from '../../../../axios'
import { formatUsername, formatDate } from "@/app/_utils/formatStrings"

import { useRouter } from "next/navigation"
import VideoUploader from "./videoUploader"
import DefaultTiptap from "./defaultTipTap"
import ResultModal from "@/app/_modals/resultModal"
import HTMLRender from "./htmlRender"
import { BsPersonCircle, BsThreeDots } from "react-icons/bs"
import { Post } from "../../../../interfaces/post.interface"
import ReactPlayer from "react-player"

import LikeDislikeCmt from "../buttons/likeDislikeCmt"
import UserBio from "./userBio"
import LoadingModal from "@/app/_modals/loadingModal"
import GeneralPost from "../generalPost"


export default function UserTab () {

    const { user, isAuthenticated, setUser } = useAuth() 

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [tempPfp, setTempPfp] = useState<string | undefined>('')

    /* const [selectedImg, setSelectedImg] = useState<any>()

    useEffect(() => {
        console.log('selectedImg change:', selectedImg)
    }, [selectedImg]) */

    const [isImgSaving, setIsImgSaving] = useState(false)
    const [isImgLoading, setIsImgLoading] = useState(false)

    const router = useRouter()

    const [postData, setPostData] = useState<any>()
    const [videoData, setVideoData] = useState<File[] | null>(null)
    const [resultMsg, setResultMsg] = useState('')

    const [updatedBio, setUpdatedBio] = useState()

    const [mostRecentPost, setMostRecentPost] = useState<Post>()
    const [friendsRecentPost, setFriendsRecentPost] = useState<Post[]>([])

    const [resetForm, setResetForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    

    const handleImgUpload = async () => {
        console.log(fileInputRef.current?.files)
       
        
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
            const selectedFile = fileInputRef.current.files[0]
            console.log('selected img file:', selectedFile)
            

            const formData = new FormData()
            formData.append('file', selectedFile, selectedFile.name)

            try {
                setIsImgLoading(true)
                const response = await axiosInstance.post('/api/user/updatepfp', formData, {
                    withCredentials: true
                })

                if (response.data.success) {
                    console.log(response.data.message)
                    setTempPfp(response.data.url)
                    setIsImgLoading(false)
                    
                    
                }

            } catch (err:any) {
                console.error(err)
                setIsImgLoading(false)
                if (err.response.status === 401) {
                    router.push('/')
                } 
            }
        }
    }

    const handleSaveImage = async () => {
        try {
            setIsImgSaving(true)
            const response = await axiosInstance.post('/api/user/savepfp', {
                imageUrl: tempPfp
            }, {
                withCredentials: true
            })

            if (response.data.success) {

                setUser((prev:any) => ({
                    ...prev!,
                    image: response.data.updatedImage
                }))
                setIsImgSaving(false)
            }

        } catch (err) {
            console.error(err)
            setIsImgSaving(false)
        }
    }

    const createGeneralPost = async () => {
        
        try {
            console.log('general post data:', postData)
            console.log('general video data:', videoData)
            const formData = new FormData()
            if (postData && !videoData) {
                setIsLoading(true)
                const json = postData.getJSON()
                const response = await axiosInstance.post('/api/post/create' , {
                    content: json
                }, {
                    withCredentials: true
                })

                if (response.data.success) {
                    setIsLoading(false)
                    console.log(response.data.message)
                    setResultMsg(response.data.message)
                    setResetForm(true)
                    setMostRecentPost(response.data.mostRecentPost[0])
                    console.log(response.data)
                }

            } else if (videoData && postData) {
                setIsLoading(true)
                formData.append('video', videoData[0])
                
                const editorJson = JSON.stringify(postData.getJSON())
                formData.append('content', editorJson)
                
                

                const response = await axiosInstance.post('/api/post/create2', formData, {
                    withCredentials: true,
                    timeout: 10000,
                })

                if (response.data.success) {
                    setIsLoading(false)
                    console.log(response.data.message)
                    setResultMsg(response.data.message)
                    setResetForm(true)
                    setMostRecentPost(response.data.mostRecentPost[0])
                }
            } else {
                console.log('Must write something.')
                setResultMsg('Must write something to post.')
            }

        } catch(err) {
            if (err.response.status === 401) {
                router.push('/')
            }
            setIsLoading(false)
            setResultMsg('An error has occured.')
            console.error(err)
        }
    }

    const displayAllRecentPosts = async () => {
        try {
            /* this api will get updated bio as well */
            const response = await axiosInstance.get(`/api/posts/timeline-get`, {
                withCredentials: true
            })

            if (response.data.timeline) {
                console.log(response.data.timeline)
                setFriendsRecentPost(response.data.timeline)
                setMostRecentPost(response.data.mostRecent[0])
                console.log(response.data.mostRecent)
                console.log(response.data.updatedBio)
                setUpdatedBio(JSON.parse(response.data.updatedBio))
                
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
            displayAllRecentPosts()
    }, [])



    return (
        <>
            
            { user &&
            <div className="flex flex-col gap-4"> 
            <h3>Welcome, {formatUsername(user.name)}#{user.uniqueId}!</h3>

                <div className="userbio flex border shadow py-4 px-4 bg-white rounded gap-4">
                    <div className="flex-1 up-cont flex flex-col gap-4">
                        { tempPfp || user.image ?
                        <>
                         <label htmlFor="imageInput" className={`${isImgSaving && 'disabled'} pfp-label`}>
                         <input type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                             display: 'none'
                         }}></input>
                        <div className="pfp-cont">
                        <Image src={tempPfp as string || user.image as string} alt="user profile picture" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill={true} priority={true}></Image>
                        </div>
                        </label>
                    
                        <button className={`shadow bg-blue-500 rounded-xl p-1 text-white ${isImgSaving || isImgLoading && 'disabled text'}`} onClick={handleSaveImage}><p className={`${isImgLoading || isImgSaving ? 'loading-text' : ''}`}>{`${isImgLoading ? 'Loading...': ''} ${isImgSaving ? 'Saving...' : ''} ${!isImgLoading && !isImgSaving ?  'Save': ''}`}</p></button>

                    
                        
                        </>
                         :
                        <>
                        <label htmlFor="imageInput" className={`${isImgSaving && 'disabled'}`}>
                            <input className={`${isImgSaving && 'disabled'}`} type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                                display: 'none'
                            }}></input>
                        <div className="pfp-cont">
                        <UserPortrait></UserPortrait>
                        </div>
                        </label>
                        <button className={`shadow bg-blue-500 rounded-xl p-1 text-white ${isImgSaving || isImgLoading && 'disabled text'}`} onClick={handleSaveImage}><p className={`${isImgLoading || isImgSaving ? 'loading-text' : ''}`}>{`${isImgLoading ? 'Loading...': ''} ${isImgSaving ? 'Saving...' : ''} ${!isImgLoading && !isImgSaving ? 'Save' : ''}`}</p></button>
                        </>
                        
                        }
                    </div>
                    <div className="flex-3">
                        {user && updatedBio ?
                        <UserBio bio={updatedBio}></UserBio> :
                        <UserBio bio={null}></UserBio>
                        }
                    </div>
                </div>

                <h3>What's on your mind?</h3>
                    
                <div className="flex flex-col gap-2 bg-white p-4 relative shadow rounded">
                {resultMsg &&
                <ResultModal resultMsg={resultMsg} closeModal={() => setResultMsg('')}></ResultModal>
                }
                {isLoading &&
                <LoadingModal></LoadingModal>
                }
                    
                    <div className="vtt-post-cont p-2">
                    <button className="vtt-post-btn py-1 px-4 rounded-lg text-white" onClick={createGeneralPost}>Post</button>
                    </div>
                    <DefaultTiptap setPost={setPostData} resetForm={resetForm} setResetForm={setResetForm}></DefaultTiptap>

                    <VideoUploader setVideoData={setVideoData}></VideoUploader>
                    </div>
                    <h3>Your most recent post</h3>
                    {user && mostRecentPost &&
                        <GeneralPost post={mostRecentPost} setPost={setMostRecentPost} mode="single"></GeneralPost>
                    }
                    {
                        user && user.friendlist.length > 0 &&
                        <>
                        <h3>What your friends are yapping about</h3>
                        <div className="frd-posts-cont flex flex-col gap-2">
                        {
                            friendsRecentPost && friendsRecentPost.map((node) => {
                                return (
                                    <GeneralPost key={node._id} post={node} setPost={setFriendsRecentPost} mode={'array'}></GeneralPost>
                                )
                            })
                        }
                        </div>
                        </>
                    }
                    
                </div>
                
                

           
            }


        </>
    )
}