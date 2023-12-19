'use client'

import { useEffect, useState, Suspense } from "react"
import { useAuth } from "../../../../context/authContext"


export default function Groups () {
    const [userVideos, setUserVideos] = useState('')

    const { isAuthenticated } = useAuth()

    useEffect(() => {
        isAuthenticated()
    },[])

    useEffect(()=> {
        const imitateApi = async () => {
            await new Promise(resolve => setTimeout(resolve, 10000))

            setUserVideos('The video tab')
        }
        imitateApi()
    }, [])

    return (
        <>
        {userVideos}
        </>
    )

    
    
}