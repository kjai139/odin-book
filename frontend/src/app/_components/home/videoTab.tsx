
import { Suspense, useEffect, useState } from "react"
import VideoUploader from "./videoUploader"
import DefaultTiptap from './defaultTipTap'
import axiosInstance from '../../../../axios'
import LoadingModal from '../../_modals/loadingModal'
import HTMLRender from "./htmlRender"
import { useAuth } from "../../../../context/authContext"
import { useRouter } from "next/navigation"
import ReactPlayer from "react-player"

export default function VideoTab () {

    const [postData, setPostData] = useState<any>(null)
    const [videoData, setVideoData] = useState<File[] | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [txtPreview, setTxtPreview] = useState()

    const [vidOnlyPosts, setVidOnlyPosts] = useState<Posts | []>([])

    const { user, setUser } = useAuth()
    const router = useRouter()

    interface Posts {
        _id: string,
        author: string,
        body: string,
        comments: [number],
        createdAt: Date,
        dislikes: number,
        likes: number,
        videos: [string]
    }

    const getVideoOnlyPosts = async () => {
        try {
            const response = await axiosInstance.get('/api/vids/get', {
                withCredentials: true
            })

            if (response.data.updatedUser) {
                setVidOnlyPosts(response.data.updatedUser.posts)
                console.log('vid only posts:', response.data.updatedUser.posts)
            }

        } catch (err:any) {
            console.error(err)
            if (err.response && err.response.status === 401) {
                router.push('/')
            }
        }
    }

    const createVideoPost = async () => {
        try {
            console.log('Postdata:', postData)
            console.log('VideoData:', videoData)
            console.log(postData?.isEmpty)
            if (postData && !postData.isEmpty && videoData) {
                console.log('post data valid, posting...')
                const editorJson = JSON.stringify(postData.getJSON())
                const editorHtml = postData.getHTML()
                const videoFormData = new FormData()
                videoFormData.append('video', videoData[0])
                videoFormData.append('content', editorJson)
                console.log(editorHtml, editorJson)
                setTxtPreview(editorHtml)
                
                setIsLoading(true)
                const response = await axiosInstance.post('/api/post/create2', videoFormData, {
                    withCredentials: true,
                    timeout: 10000,
                })

                if (response.data.success) {
                    setIsLoading(false)
                    setUser(response.data.updatedUser)
                    console.log(response.data.message)
                    
                }
            }

        } catch (err) {
            setIsLoading(false)
            console.error(err)
        }
    }

    useEffect(() => {
        getVideoOnlyPosts()
    }, [])

    return (
        <>
            <div className="flex flex-col gap-2 bg-white p-4 relative">
                {isLoading && 
                <LoadingModal />
                }
                <div className="vtt-post-cont p-2">
                <button className="vtt-post-btn py-1 px-4 rounded-lg text-white" onClick={createVideoPost}>Post</button>
                </div>
                <DefaultTiptap setPost={setPostData}></DefaultTiptap>
                <VideoUploader setVideoData={setVideoData}></VideoUploader>
                {/* {txtPreview && <HTMLRender editorOBJ={txtPreview}></HTMLRender>} */}
            </div>
            {vidOnlyPosts &&
                vidOnlyPosts.map((post:Posts) => {
                    let json = post.body
                    if (typeof json === 'string') {
                        json = JSON.parse(json)
                    }
                    return (
                        <div key={post._id}>
                            <HTMLRender editorOBJ={json}></HTMLRender>
                            <ReactPlayer url={post.videos[0].url} controls={true} width="100%" height="auto"></ReactPlayer>
                        </div>
                    )
                } )
                }
        </>
    )
}