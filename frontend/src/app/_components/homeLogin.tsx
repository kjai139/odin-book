"use client"
import { ChangeEvent, useState } from "react"
import axiosInstance from '../../../axios'

export default function HomeLogin () {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleUsernameInput = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePwInput = (e:ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async () => {
        const response = await axiosInstance.post('/api/user/create', {
            username: username,
            
        })
    }
 
    return (
        <div className="flex-1 flex">
            <form className="flex flex-col flex-1 p-4 gap-4">
                
                <input type="text" placeholder="Email or phone number" onChange={handleUsernameInput} autoComplete="off"></input>
                <input type="password" placeholder="Enter password" onChange={handlePwInput} autoComplete="off"></input>
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