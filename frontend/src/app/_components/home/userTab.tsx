import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import Image from "next/image"
import { UserPortrait } from "../SVGRComponent"
import axiosInstance from '../../../../axios'
import { formatUsername } from "@/app/_utils/formatStrings"
import { ProgressBar } from "react-loader-spinner"
import { useRouter } from "next/navigation"


export default function UserTab () {

    const { user, isAuthenticated, setUser } = useAuth() 

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [tempPfp, setTempPfp] = useState<string | undefined>('')

    /* const [selectedImg, setSelectedImg] = useState<any>()

    useEffect(() => {
        console.log('selectedImg change:', selectedImg)
    }, [selectedImg]) */

    const [isImgSaving, setIsImgSaving] = useState(false)
    const [isImgLoading, setIsImgLoading] = useState(false)

    const router = useRouter()

    

    const handleImgUpload = async () => {
        console.log(fileInputRef.current?.files)
       
        
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
            const selectedFile = fileInputRef.current.files[0]
            console.log('selected img file:', selectedFile)
            

            const formData = new FormData()
            formData.append('file', selectedFile, selectedFile.name)

            try {
                setIsImgLoading(true)
                const response = await axiosInstance.post('/api/user/updatepfp', formData, {
                    withCredentials: true
                })

                if (response.data.success) {
                    console.log(response.data.message)
                    setTempPfp(response.data.url)
                    setIsImgLoading(false)
                    
                    
                }

            } catch (err:any) {
                console.error(err)
                setIsImgLoading(false)
                if (err.response.status === 401) {
                    router.push('/')
                } 
            }
        }
    }

    const handleSaveImage = async () => {
        try {
            setIsImgSaving(true)
            const response = await axiosInstance.post('/api/user/savepfp', {
                imageUrl: tempPfp
            }, {
                withCredentials: true
            })

            if (response.data.success) {

                setUser((prev) => ({
                    ...prev!,
                    image: response.data.updatedImage
                }))
                setIsImgSaving(false)
            }

        } catch (err) {
            console.error(err)
            setIsImgSaving(false)
        }
    }



    return (
        <>
            { user &&
            <div className="flex flex-col gap-4 mt-8"> 
            <h3>Welcome, {formatUsername(user.name)}#{user.uniqueId}!</h3>

                <div className="flex border shadow py-4 px-4 bg-white rounded gap-4">
                    <div className="flex-1 up-cont flex flex-col gap-4">
                        { tempPfp || user.image ?
                        <>
                         <label htmlFor="imageInput" className={`${isImgSaving && 'disabled'}`}>
                         <input type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                             display: 'none'
                         }}></input>
                        <div className="pfp-cont">
                        <Image src={tempPfp as string || user.image as string} alt="user profile picture" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill={true}></Image>
                        </div>
                        </label>
                    
                        <button className={`shadow bg-blue-500 rounded-xl p-1 text-white ${isImgSaving || isImgLoading && 'disabled text'}`} onClick={handleSaveImage}><p className={`${isImgLoading || isImgSaving ? 'loading-text' : ''}`}>{`${isImgLoading ? 'Loading...': ''} ${isImgSaving ? 'Saving...' : ''} ${!isImgLoading && !isImgSaving ?  'Save': ''}`}</p></button>

                    
                        
                        </>
                         :
                        <>
                        <label htmlFor="imageInput" className={`${isImgSaving && 'disabled'}`}>
                            <input className={`${isImgSaving && 'disabled'}`} type="file" onChange={handleImgUpload} ref={fileInputRef} id="imageInput" accept="image/*" style={{
                                display: 'none'
                            }}></input>
                        <div className="pfp-cont">
                        <UserPortrait></UserPortrait>
                        </div>
                        </label>
                        <button className={`shadow bg-blue-500 rounded-xl p-1 text-white ${isImgSaving || isImgLoading && 'disabled text'}`} onClick={handleSaveImage}><p className={`${isImgLoading || isImgSaving ? 'loading-text' : ''}`}>{`${isImgLoading ? 'Loading...': ''} ${isImgSaving ? 'Saving...' : ''} ${!isImgLoading && !isImgSaving ? 'Save' : ''}`}</p></button>
                        </>
                        
                        }
                    </div>
                    <div className="flex-3">
                        Text stuff
                    </div>
                </div>

                <div>
                    Timeline section
                    <button onClick={() => setIsImgSaving(!isImgSaving)}><ProgressBar borderColor="white" barColor="white"></ProgressBar></button>
                </div>

            </div>
            }


        </>
    )
}