'use client'

import React, {createContext, useState, useContext, ReactNode} from "react";
import axiosInstance from '../axios'
import {useRouter} from "next/navigation";

interface AuthContexType {
    user: User | null,
    isAuthenticated: () => void,
    signOut: () => void
}

type User = {
    _id: string,
    name: string,
    email: string,
    phoneNumber: string | undefined | null,
    image: string | undefined | null,
    gender: string,
    friendlist: [] | string[],
    friendReq: [] | string[]
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContexType | undefined >(undefined)

const AuthProvider:React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null >(null)
    const router = useRouter()

    const isAuthenticated = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/check', {
                withCredentials: true
            })

            if (response.data.success) {
                
                setUser(response.data.user)
                
            } else {
                console.log('user is not authenticated')
                router.push('/')
            }

        } catch (err) {
            console.error('error in isAuthenticated:', err)
            router.push('/')
        }
    }

    const signOut = async () => {
        try {
            const response = await axiosInstance.delete('/api/auth/signOut', {
                withCredentials: true
            })

            if (response.data.success) {
                router.push('/')
            }
        } catch (err) {
            console.error('error in signOut', err)
        }
    }


    return (
        <AuthContext.Provider value={{user, isAuthenticated, signOut}}>
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