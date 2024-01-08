import { useForm, SubmitHandler } from "react-hook-form"


type Inputs = {
    username: string
}


export default function AddFriends () {

    const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
    // defining the func in ts if not reusing

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <label>Username</label>
                <input {...register('username', { 
                    required: 'Please enter a username.', 
                    pattern: { 
                        value:/^[a-zA-Z]+#[a-zA-Z0-9]+$/i,
                        message: 'Invalid format.'
                        } })}></input>
                { errors.username && <p>{errors.username.message}</p> }
                <div className="flex justify-end">
                    <button type="submit">Add friend</button>
                </div>
            </form>
        </>
    )
}