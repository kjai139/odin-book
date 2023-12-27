
import { Suspense, useEffect, useState } from "react"
import VideoUploader from "./videoUploader"
import DefaultTiptap from './defaultTipTap'
import axiosInstance from '../../../../axios'
import LoadingModal from '../../_modals/loadingModal'
import HTMLRender from "./htmlRender"

export default function VideoTab () {

    const [postData, setPostData] = useState<any>(null)
    const [videoData, setVideoData] = useState<File[] | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [txtPreview, setTxtPreview] = useState()

    const createVideoPost = async () => {
        try {
            console.log('Postdata:', postData)
            console.log('VideoData:', videoData)
            console.log(postData?.isEmpty)
            if (postData && !postData.isEmpty && videoData) {
                console.log('post data valid, posting...')
                const editorJson = postData.getJSON()
                const editorHtml = postData.getHTML()
                const videoFormData = new FormData()
                videoFormData.append('video', videoData[0])
                videoFormData.append('textbodyjson', editorJson)
                console.log(editorHtml, editorJson)
                setTxtPreview(editorHtml)
                
                /* setIsLoading(true)
                const response = await axiosInstance.post('/api/post/create2', videoFormData, {
                    withCredentials: true
                })

                if (response.data.success) {
                    setIsLoading(false)
                    console.log(response.data.message)
                    
                } */
            }

        } catch (err) {
            setIsLoading(false)
            console.error(err)
        }
    }

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
                {txtPreview && <HTMLRender editorOBJ={txtPreview}></HTMLRender>}
            </div>
        </>
    )
}