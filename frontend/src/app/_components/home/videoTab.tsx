
import Loading from "@/app/dashboard/loading"
import { Suspense, useEffect, useState } from "react"

export default function VideoTab () {

    const [userVideos, setUserVideos] = useState('')

    useEffect(()=> {
        const imitateApi = async () => {
            await new Promise(resolve => setTimeout(resolve, 10000))

            setUserVideos('The video tab')
        }
        imitateApi()
    }, [])

    return (
        <Suspense fallback={<Loading />}>
        <div>{userVideos}</div>
        </Suspense>
    )
}