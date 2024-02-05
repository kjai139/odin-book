
import { User } from "../../../../interfaces/user.interface"
import axiosInstance from '../../../../axios'
import { notFound } from "next/navigation"

async function fetchUser(id) {
    const res = await fetch(`http://localhost:4000/api/user/getPage/?id=${id}`)
    if (!res.ok) return undefined
    return res.json()
}


export default async function UserDetails({ params }) {

    const user = await fetchUser(params.slug)
    console.log(params.slug)

    if (!user) {
        notFound()
    } else {
        console.log('USER:', user.userInfo)
    }
    
    
    return (
        <>
            <div>
            <h1>USER DETAILS PAGE: {params.slug}</h1>
            </div>
        </>
    )
}