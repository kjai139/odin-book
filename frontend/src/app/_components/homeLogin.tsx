"use client"
import { useState } from "react"


export default function HomeLogin () {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className="flex-1 flex">
            <form className="flex flex-col flex-1 p-4 gap-4">
                
                <input type="text" placeholder="Email or phone number"></input>
                <input type="password" placeholder="Enter password"></input>
                <button type="submit">Log in</button>
                <button type="button">Forgot password?</button>
                <button>Create new account</button>
            </form>
            

        
        </div>
        

    )
}