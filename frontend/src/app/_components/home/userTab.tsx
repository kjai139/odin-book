import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"
import axiosInstance from '../../../../axios'
import { formatUsername, formatDate } from "@/app/_utils/formatStrings"
import { ProgressBar } from "react-loader-spinner"
import { useRouter } from "next/navigation"
import VideoUploader from "./videoUploader"
import DefaultTiptap from "./defaultTipTap"
import ResultModal from "@/app/_modals/resultModal"
import HTMLRender from "./htmlRender"
import { BsPersonCircle } from "react-icons/bs"
import { Post } from "../../../../interfaces/post.interface"
import ReactPlayer from "react-player"
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { FaRegComment } from "react-icons/fa"
import LikeDislikeCmt from "../buttons/likeDislikeCmt"
import UserBio from "./userBio"


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

    const [yourRecentPost, setYourRecentPost] = useState()
    const [friendsRecentPost, setFriendsRecentPost] = useState<Post[]>([])

    

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
                const json = postData.getJSON()
                const response = await axiosInstance.post('/api/post/create' , {
                    content: json
                }, {
                    withCredentials: true
                })

                if (response.data.success) {
                    console.log(response.data.message)
                    setResultMsg(response.data.message)
                }

            } else if (videoData && postData) {
                formData.append('video', videoData[0])
                
                const editorJson = postData.getJSON()
                formData.append('content', editorJson)
            
                formData.append('content', '')
                
                

                const response = await axiosInstance.post('/api/post/create2', formData, {
                    withCredentials: true,
                    timeout: 10000,
                })

                if (response.data.success) {
                    console.log(response.data.message)
                    setResultMsg(response.data.message)
                }
            } else {
                console.log('Must write something.')
                setResultMsg('Must write something to post.')
            }

        } catch(err) {
            console.error(err)
        }
    }

    const displayAllRecentPosts = async () => {
        try {
            const response = await axiosInstance.get(`/api/posts/timeline-get`, {
                withCredentials: true
            })

            if (response.data.timeline) {
                console.log(response.data.timeline)
                setFriendsRecentPost(response.data.timeline)
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
            {resultMsg &&
            <ResultModal resultMsg={resultMsg} closeModal={() => setResultMsg('')}></ResultModal>
            }
            { user &&
            <div className="flex flex-col gap-4"> 
            <h3>Welcome, {formatUsername(user.name)}#{user.uniqueId}!</h3>

                <div className="flex border shadow py-4 px-4 bg-white rounded gap-4">
                    <div className="flex-1 up-cont flex flex-col gap-4">
                        { tempPfp || user.image ?
                        <>
                         <label htmlFor="imageInput" className={`${isImgSaving && 'disabled'}`}>
                         <input type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                             display: 'none'
                         }}></input>
                        <div className="pfp-cont">
                        <Image src={tempPfp as string || user.image as string} alt="user profile picture" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill={true} priority></Image>
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
                        {user && user.bio ?
                        <UserBio mode={'display'}></UserBio> :
                        <UserBio mode="writer"></UserBio>
                        }
                    </div>
                </div>

                <h3>What's on your mind?</h3>
                    
                <div className="flex flex-col gap-2 bg-white p-4 relative shadow rounded">
                    
                    <div className="vtt-post-cont p-2">
                    <button className="vtt-post-btn py-1 px-4 rounded-lg text-white" onClick={createGeneralPost}>Post</button>
                    </div>
                    <DefaultTiptap setPost={setPostData}></DefaultTiptap>

                    <VideoUploader setVideoData={setVideoData}></VideoUploader>
                    </div>
                    <h3>Your most recent post</h3>
                    {user && user.posts &&
                    <>  
                        <div className="post-cont rounded shadow">
                        <div className='flex gap-2 p-2 items-center'>
                        {user.posts[0].author.image ?
                        <div className='relative post-pfp-cont rounded-full overflow-hidden'>
                        <Image src={user.posts[0].author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                        </div>
                        :
                        <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                        }
                        <div>
                            <p className='text-sm'>{formatUsername(user.posts[0].author.name)}</p>
                            <p className='date-txt'>{formatDate(user.posts[0].createdAt)}</p>
                        </div>

                        </div>
                        <HTMLRender editorOBJ={user.posts[0].body}></HTMLRender>
                        {user.posts[0].videos && user.posts[0].videos.length > 0 &&
                                        user.posts[0].videos.map((video) => {
                                            return (
                                                <ReactPlayer key={video._id} url={video.url} controls={true} width="100%" height="auto"></ReactPlayer>
                                            )
                                        })
                        }
                                        <div className="p-2 text-sm">
                                            <p>{`${user.posts[0].likes} likes and ${user.posts[0].dislikes} dislikes.`}</p>
                                        </div>
                                        <LikeDislikeCmt thePost={user.posts[0]} setRenderState={setFriendsRecentPost}></LikeDislikeCmt>
                        
                        </div>
                    </>
                    }
                    {
                        user && user.friendlist.length > 0 &&
                        <>
                        <h3>What your friends are yapping about</h3>
                        <div className="frd-posts-cont flex flex-col gap-2">
                        {
                            friendsRecentPost && friendsRecentPost.map((node) => {
                                return (
                                    <div key={node._id} className="post-cont rounded shadow">
                                        <div className='flex gap-2 p-2 items-center'>
                                        {node.author.image ?
                                        <div className='relative post-pfp-cont rounded-full overflow-hidden'>
                                        <Image src={node.author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                                        </div>
                                        :
                                        <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                                        }
                                        <div>
                                            <p className='text-sm'>{formatUsername(node.author.name)}</p>
                                            <p className='date-txt'>{formatDate(node.createdAt)}</p>
                                        </div>

                                        </div>
                                        <HTMLRender editorOBJ={node.body}></HTMLRender>
                                        {node.videos && node.videos.length > 0 &&
                                        node.videos.map((video) => {
                                            return (
                                                <ReactPlayer key={video._id} url={video.url} controls={true} width="100%" height="auto"></ReactPlayer>
                                            )
                                        })
                                        }
                                        <div className="p-2 text-sm">
                                            <p>{`${node.likes} likes and ${node.dislikes} dislikes.`}</p>
                                        </div>
                                        <LikeDislikeCmt thePost={node} setRenderState={setFriendsRecentPost}></LikeDislikeCmt>
                                        </div>
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