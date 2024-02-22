import { useForm, SubmitHandler } from "react-hook-form"
import axiosInstance from '../../../../axios'
import { useEffect, useState } from "react"

type Inputs = {
    username: string
}


export default function AddFriends () {

    const { register, handleSubmit, reset, formState, formState: { errors, isSubmitSuccessful }, } = useForm<Inputs>()
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log('form submitted', data)
        setIsLoading(true)
        try {
            const splitInput = data.username.split('#')
            const username = splitInput[0]
            const uniqueId = splitInput[1]
            const response = await axiosInstance.post('/api/friend/request/add-by-name', {
                name: username,
                uniqueId: uniqueId
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                setIsLoading(false)
                console.log(response.data.message)
            } else {
                setIsLoading(false)
                console.log(response.data.message)
            }

        } catch (err) {
            setIsLoading(false)
            console.error(err)
        }
    }
    // defining the func in ts if not reusing
    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({
                username: ''
            })
        }
    }, [formState, reset])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <label className="font-bold">ADD FRIEND</label>
                <div className="relative flex frd-add-div">
                <input {...register('username', { 
                    required: 'Please enter a username.', 
                    pattern: { 
                        value:/^[a-zA-Z\s]+#[a-zA-Z0-9]+$/i,
                        message: 'Invalid format.Ex.Joey#2412'
                        } })} className="flex-1 p-2 rounded frd-add-inp" maxLength={25} autoComplete="off" placeholder="Enter name here... Ex.Joey#1234">

                </input>
                { errors.username && <p className="absolute top-full text-red-500 text-bold">{errors.username.message}</p> }
                <div className={`flex absolute top-0 right-0 ${isLoading && 'na-wrap'}`}>
                    <button type="submit" className={`bg-blue-500 py-1 px-2 my-1 mx-1 rounded ${isLoading && 'disabledBtn'}`}>Send request</button>
                </div>
                </div>
            </form>
        </>
    )
}