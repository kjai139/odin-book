import { useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"



export default function UserTab () {

    const { user, isAuthenticated } = useAuth() 

    


    return (
        <div>
            { user &&
            <div className="flex flex-col gap-4 mt-8"> 
            <h3>Welcome, {user.name}!</h3>

                <div className="flex border shadow py-4 px-4 bg-white rounded gap-4">
                    <div className="flex-1">
                        { user.image ?
                        <Image src={user.image} alt="user profile picture"></Image> :
                        <UserPortrait></UserPortrait>
                        }
                    </div>
                    <div className="flex-4">
                        Text stuff
                    </div>
                </div>

                <div>
                    Timeline section
                </div>

            </div>
            }


        </div>
    )
}