"use client"
import { useEffect, useState } from "react"
import axiosInstance from '../../../axios'
import { AxiosError } from "axios"

import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import SignUpModal from "../_modals/signupModal"
import { useRouter } from 'next/navigation'
import LoadingModal from "../_modals/loadingModal"
import ResultModal from "../_modals/resultModal"
import { useAuth } from "../../../context/authContext"
import { getServerSideProps } from "next/dist/build/templates/pages"

export default function HomeLogin () {

    const router = useRouter()
    const { isAuthenticated, doneLoading, user, pathname } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

    const schema = yup.object({
        username: yup.string().required('Please enter your email or phone number.'),
        password: yup.string().required('Please enter your password.')
    })
    

    type Inputs = {
        username: string,
        password: string
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState,
        formState: { errors, isSubmitSuccessful },
    } = useForm<Inputs>({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data:Inputs) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post('/api/user/login', {
                username: data.username,
                password: data.password
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                
                router.push('/dashboard')
            }
        } catch (err:any) {
            setIsLoading(false)
            console.error(err)
            setErrorMsg(err.response.data.message)

                   
        }
    }
    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({
                username: '',
                password: ''
            })
        }
    }, [formState, reset])
    // console.log(watch('username'))

    /* useEffect(() => {

    }, []) */

    useEffect(() => {
        if (doneLoading && pathname) {
            isAuthenticated()
        }
        
    }, [doneLoading])
    
   
 
    return (
        <div className="flex-1 flex relative login-cont border shadow rounded bg-white">
            <form className="flex flex-col flex-1 p-4 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                <input className="border rounded" {...register('username', {required: true})} type="text" placeholder="Email or phone number" autoComplete="off" aria-invalid={errors.username ? true: false }>
                </input>
                <p className="error-msg">{errors.username?.message}</p>
                </div>
                <div className="relative">
                <input className="border rounded" type="password" placeholder="Enter password" autoComplete="off" {...register('password')}></input>
                <p className="error-msg">{errors.password?.message}</p>
                </div>
                <div className="flex justify-center">
                <button type="submit">Log in</button>
                </div>
                <div className="flex justify-center text-sm">
                <button type="button" className="text-blue-500">Forgot password?</button>
                </div>
                <div className="justify-center flex">
                <button className="bg-blue-500 text-white rounded py-2 px-4" type="button" onClick={() => setIsCreateFormOpen(true)}>Create new account</button>
                </div>
            </form>
            <div className={`overlay flex justify-center items-center ${isCreateFormOpen ? 'active' : 'inactive'}`}>
            {isCreateFormOpen && 
                
                <SignUpModal closeModal={() => setIsCreateFormOpen(false)}></SignUpModal>
                
            }
            </div>
            {isLoading && <LoadingModal></LoadingModal>}
            {errorMsg && <ResultModal resultMsg={errorMsg} closeModal={() => setErrorMsg('')}></ResultModal>}
            

        
        </div>
        

    )
}