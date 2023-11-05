"use client"
import { useEffect, useState } from "react"
import axiosInstance from '../../../axios'
import { AxiosError } from "axios"

import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

export default function HomeLogin () {

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
        try {
            const response = await axiosInstance.post('/api/account/login', {
                username: data.username,
                password: data.password
            }, {
                withCredentials: true
            })
        } catch (err) {
            
            if (err instanceof AxiosError) {
                if (err.response) {
                    console.error('Response Status:', err.response.status)
                    console.error('Response Data:', err.response.data)
                } else {
                    console.error('Axios error:', err)
                }
            } else {
                console.error('non axios error', err)
            }
            
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
    console.log(watch('username'))

    const onSubmitAxios = async (e:React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post('/api/user/create', {
                
            }, {
                withCredentials: true
            })
        } catch (err) {
            
            if (err instanceof AxiosError) {
                if (err.response) {
                    console.error('Response Status:', err.response.status)
                    console.error('Response Data:', err.response.data)
                } else {
                    console.error('Axios error:', err)
                }
            } else {
                console.error('non axios error', err)
            }
            
        }
    }
 
    return (
        <div className="flex-1 flex">
            <form className="flex flex-col flex-1 p-4 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                <input {...register('username', {required: true})} type="text" placeholder="Email or phone number" autoComplete="off" aria-invalid={errors.username ? true: false }>
                </input>
                <p className="error-msg">{errors.username?.message}</p>
                </div>
                <div className="relative">
                <input type="password" placeholder="Enter password" autoComplete="off" {...register('password')}></input>
                <p className="error-msg">{errors.password?.message}</p>
                </div>
                <div className="flex justify-center">
                <button type="submit">Log in</button>
                </div>
                <div className="flex justify-center text-sm">
                <button type="button" className="text-blue-500">Forgot password?</button>
                </div>
                <div className="justify-center flex">
                <button className="bg-blue-500 rounded py-2 px-4" >Create new account</button>
                </div>
            </form>
            

        
        </div>
        

    )
}