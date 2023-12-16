import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"
import axiosInstance from '../../../../axios'
import { formatUsername } from "@/app/_utils/formatStrings"


export default function UserTab () {

    const { user, isAuthenticated } = useAuth() 

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [tempPfp, setTempPfp] = useState('')

    /* const [selectedImg, setSelectedImg] = useState<any>()

    useEffect(() => {
        console.log('selectedImg change:', selectedImg)
    }, [selectedImg]) */

    const handleImgUpload = async () => {
        console.log(fileInputRef.current?.files)
       
        
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
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
                    setTempPfp(response.data.url)
                    
                    
                }

            } catch (err) {
                console.error(err)
                
            }
        }
    }

    const handleSaveImage = async () => {
        try {
            const response = await axiosInstance.post('/api/user/savepfp', {
                imageUrl: tempPfp
            }, {
                withCredentials: true
            })

        } catch (err) {

        }
    }


    return (
        <div>
            { user &&
            <div className="flex flex-col gap-4 mt-8"> 
            <h3>Welcome, {formatUsername(user.name)}#{user.uniqueId}!</h3>

                <div className="flex border shadow py-4 px-4 bg-white rounded gap-4">
                    <div className="flex-1 up-cont flex flex-col gap-4">
                        { user.image || tempPfp ?
                        <>
                         <label htmlFor="imageInput">
                         <input type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                             display: 'none'
                         }}></input>
                        <div className="pfp-cont">
                        <Image src={user.image ? user.image : tempPfp} alt="user profile picture" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill={true}></Image>
                        </div>
                        </label>
                        <button className="shadow bg-blue-500 rounded-xl p-1 text-white">Save image</button>
                        </>
                         :
                        <>
                        <label htmlFor="imageInput">
                            <input type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                                display: 'none'
                            }}></input>
                        <div className="pfp-cont">
                        <UserPortrait></UserPortrait>
                        </div>
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