import { useEffect, useRef } from "react"
import { useAuth } from "../../../../context/authContext"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"
import axiosInstance from '../../../../axios'


export default function UserTab () {

    const { user, isAuthenticated } = useAuth() 

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImgUpload = async () => {
        
        if (fileInputRef.current && fileInputRef.current.files ) {
            const selectedFile = fileInputRef.current.files[0]
            console.log('selected img file:', selectedFile)

            const formData = new FormData()
            formData.append('file', selectedFile, selectedFile.name)

            try {
                const response = await axiosInstance.post('/api/user/updatepfp', formData, {
                    withCredentials: true
                })

                if (response.data.success) {
                    console.log(response.data.message)
                }

            } catch (err) {
                console.error(err)
            }
        }
    }


    return (
        <div>
            { user &&
            <div className="flex flex-col gap-4 mt-8"> 
            <h3>Welcome, {user.name}!</h3>

                <div className="flex border shadow py-4 px-4 bg-white rounded gap-4">
                    <div className="flex-1 up-cont flex flex-col gap-4">
                        { user.image ?
                        <Image src={user.image} alt="user profile picture"></Image> :
                        <>
                        <label htmlFor="imageInput">
                            <input type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                                display: 'none'
                            }}></input>
                        <UserPortrait></UserPortrait>
                        </label>
                        <button className="shadow bg-blue-500 rounded-xl p-1 text-white">Save image</button>
                        </>
                        
                        }
                    </div>
                    <div className="flex-3">
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