'use client'

import React, {createContext, useState, useContext, ReactNode, useEffect} from "react";
import axiosInstance from '../axios'
import {useRouter, usePathname} from "next/navigation";
import { Post } from '../interfaces/post.interface'
import { User } from "../interfaces/user.interface";


interface AuthContexType {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | any>>
    isAuthenticated: () => void,
    signOut: () => void,
    doneLoading: boolean,
    pathname: string,
    previousURL: string | undefined | null,
    setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
    selectedTab: number
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
    const [previousURL, setPreviousURL] = useState<any>()
    const [curURL, setCurURL] = useState()
    const [selectedTab, setSelectedTab] = useState<number>(0)

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
                    setPreviousURL(pathname)
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

    

    useEffect(() => {
        let curURL = localStorage.getItem('curURL')
        localStorage.setItem('prevURL', curURL)
        localStorage.setItem('curURL', pathname)
    }, [pathname])


    return (
        <AuthContext.Provider value={{user, isAuthenticated, signOut, doneLoading, pathname, setUser, previousURL, setSelectedTab, selectedTab}}>
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