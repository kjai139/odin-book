import { useForm, SubmitHandler } from "react-hook-form"
import axiosInstance from '../../../../axios'

type Inputs = {
    username: string
}


export default function AddFriends () {

    const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log('form submitted', data)
        try {
            const splitInput = data.username.split('#')
            const username = splitInput[0]
            const uniqueId = splitInput[1]
            const response = await axiosInstance.post('/api/friends/add-by-name', {
                name: username,
                uniqueId: uniqueId
            })

            if (response.data.success) {
                console.log(response.data.message)
            }

        } catch (err) {
            console.error(err)
        }
    }
    // defining the func in ts if not reusing

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <label className="font-bold">ADD FRIEND</label>
                <div className="relative flex">
                <input {...register('username', { 
                    required: 'Please enter a username.', 
                    pattern: { 
                        value:/^[a-zA-Z]+#[a-zA-Z0-9]+$/i,
                        message: 'Invalid format.Ex.Joey#2412'
                        } })} className="flex-1 p-2 rounded" maxLength={25}>

                </input>
                { errors.username && <p className="absolute top-full text-red-500 text-bold">{errors.username.message}</p> }
                <div className="flex justify-end absolute top-0 right-0">
                    <button type="submit" className="bg-blue-500 py-1 px-2 my-1 mx-1 rounded">Send request</button>
                </div>
                </div>
            </form>
        </>
    )
}