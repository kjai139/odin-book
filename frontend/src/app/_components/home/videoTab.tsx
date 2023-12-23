
import Loading from "@/app/dashboard/loading"
import { Suspense, useEffect, useState } from "react"
import VideoUploader from "./videoUploader"
import DefaultTiptap from './defaultTipTap'

export default function VideoTab () {

    const [postData, setPostData] = useState(null)
    const [videoData, setVideoData] = useState<File[] | null>(null)

    return (
        <>
            <div className="flex flex-col gap-2 bg-white p-4">
                <DefaultTiptap setPost={setPostData}></DefaultTiptap>
                <VideoUploader setVideoData={setVideoData}></VideoUploader>

            </div>
        </>
    )
}