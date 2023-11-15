'use client'

import { useEffect } from "react"
import { useAuth } from "../../../context/authContext"
import { useRouter } from "next/navigation"


export default function Dashboard () {

    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated()
            if (!result) {
                console.log('USER IS NOT SIGNED IN')
                /* router.push('/') */
            } else {
                console.log('USER IS SIGNED IN')
            }
            
        }
        checkAuth()

        
    }, [])

    useEffect(() => {
        console.log('user updated -', user)
    }, [user])





    
    return (
        <div>
            <h1>
                {user && `Welcome, ${user.name}`}
            </h1>
            <button>Sign out</button>
        </div>
        
    )
}