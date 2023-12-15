'use client'

import React, {createContext, useState, useContext, ReactNode, useEffect} from "react";
import axiosInstance from '../axios'
import {useRouter, usePathname} from "next/navigation";
import initializeSocket from '../socket'

interface AuthContexType {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    isAuthenticated: () => void,
    signOut: () => void,
    doneLoading: boolean,
    pathname: string
}

interface Post {
    _id:string,
    body: string | object,
    createdAt: Date,
    likes: Number,
    dislikes: Number,
    title: string | null,
    comments: string[],
    author: string,

}

export type User = {
    _id: string,
    name: string,
    email: string,
    phoneNumber: string | undefined | null,
    image: string | undefined | null,
    gender: string,
    friendlist: string[],
    friendReq: Array<string | User>,
    posts: Post[],
    status: string,
    uniqueId: string,
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContexType | undefined >(undefined)

const AuthProvider:React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null >(null)
    
    const router = useRouter()
    const pathname = usePathname()
   
    const [doneLoading, setDoneLoading] = useState(true)

    const isAuthenticated = async () => {
        try {
            
            const response = await axiosInstance.get('/api/auth/check', {
                withCredentials: true
            })

            if (response.data.success) {
                
                setUser(response.data.user)
                console.log('current pathname:', pathname)
                if (pathname === '/') {
                    router.push('/dashboard')
                }
                
                
                
            } else {
                setUser(null)
                console.log('user is not authenticated')
                if (pathname !== '/'){
                    router.push('/')
                }
                
            }

        } catch (err) {
            console.error('error in isAuthenticated:', err)
            if (pathname !== '/'){
                router.push('/')
            }
        }
    }

    const signOut = async () => {
        try {
            const response = await axiosInstance.delete('/api/auth/signOut', {
                withCredentials: true
            })

            if (response.data.success) {
                setUser(null)
                router.push('/')
            }
        } catch (err) {
            console.error('error in signOut', err)
        }
    }

    useEffect(() => {
        console.log('User object updated:', user)
        
    }, [user])


    return (
        <AuthContext.Provider value={{user, isAuthenticated, signOut, doneLoading, pathname, setUser}}>
            {children}
        </AuthContext.Provider>
    )

}

//this is a safety measure to make sure the hook is used within intended context
const useAuth = (): AuthContexType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export {AuthProvider, useAuth}