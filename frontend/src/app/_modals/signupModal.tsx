
import axiosInstance from '../../../axios'
import { AxiosError } from "axios"

import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"


export default function SignUpModal() {

    type Gender = 'Male' | 'Female' | 'Other'
    
    const schema = yup.object({
        email: yup.string().required('email or phone number required'),
        password: yup.string().required('Password is required').min(6, 'Password must have min length of 6 characters').matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter').matches(/^(?=.*[A-Z])/, 'must contain at least one uppercase letter').matches(/^(?=.*[!@#$%^&()_+-])/, 'must have at least one special character').max(12, 'Password cannot have more than 12 characters'),
        firstName: yup.string().required('first name is required'),
        lastName: yup.string().required('last name is required'),
        phoneNumber: yup.string().required('Phone number is required'),
        birthDate: yup.date().required('birthday is required'),
        gender: yup.string().oneOf(['Male', 'Female', 'Other']).required('gender is required')
    })
    type Inputs = {
        email:string,
        password: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
       
        birthDate: Date,
        gender: Gender,
        

        
    }

    const {
        register,
        handleSubmit,
        formState,
        formState: {
            errors
        }
    
    } = useForm<Inputs>({
        resolver: yupResolver(schema)
    })



    return (
        <form>
            <div>
                <input {...register('firstName')} type='text' placeholder='Firstname'></input>
                <input {...register('lastName')} type='text' placeholder='Lastname'></input>
            </div>
            <div>
                <input {...register('password')} type='password' placeholder='Enter new password'></input>
            </div>
            <div>
                <input {...register('email')} type='email' placeholder='Enter your email'></input>
            </div>
            <div>
                <select {...register('gender')}>
                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                    <option value={'Other'}>Other</option>
                </select>
            </div>
        </form>
    )
}