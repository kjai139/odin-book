
import Loading from "@/app/dashboard/loading"
import { Suspense, useEffect, useState } from "react"
import VideoUploader from "./videoUploader"
import DefaultTiptap from './defaultTipTap'

export default function VideoTab () {

    const [postData, setPostData] = useState<any>(null)
    const [videoData, setVideoData] = useState<File[] | null>(null)

    const createVideoPost = async () => {
        try {
            console.log('Postdata:', postData)
            console.log('VideoData:', videoData)
            console.log(postData?.isEmpty)
            if (postData && !postData.isEmpty && videoData) {
                console.log('post data valid')
            }

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div className="flex flex-col gap-2 bg-white p-4 relative">
                <div className="vtt-post-cont p-2">
                <button className="vtt-post-btn py-1 px-4 rounded-lg text-white" onClick={createVideoPost}>Post</button>
                </div>
                <DefaultTiptap setPost={setPostData}></DefaultTiptap>
                <VideoUploader setVideoData={setVideoData}></VideoUploader>

            </div>
        </>
    )
}