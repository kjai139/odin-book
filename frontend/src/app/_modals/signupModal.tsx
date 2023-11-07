
import axiosInstance from '../../../axios'
import { AxiosError } from "axios"

import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import CloseButton from '../_components/icons/closeBtn.svg'

interface SignupModalProps {
    closeModal: () => void
}

export default function SignUpModal({closeModal}:SignupModalProps) {

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
        <form className='flex flex-col gap-2 rounded bg-white max-w-modal-i p-4'>
            
            <div className='flex justify-between relative'>
                <span className='text-lg'>
                    <p className='text-2xl font-bold'>Sign up</p>
                    <p>It's easy.</p>
                </span>
                <button className='close-b' type='button' onClick={closeModal}>
                    <CloseButton></CloseButton>
                </button>
                
            </div>
            <div className='flex flex-col gap-4'>
            <div className='flex gap-2'>
                <input className='modal-i' {...register('firstName')} type='text' placeholder='Firstname'></input>
                <input className='modal-i' {...register('lastName')} type='text' placeholder='Lastname'></input>
            </div>
            <div>
                <input className='modal-i' {...register('password')} type='password' placeholder='Enter new password'></input>
            </div>
            <div>
                <input className='modal-i' {...register('email')} type='email' placeholder='Enter your email'></input>
            </div>
            </div>
            <div className='flex flex-col'>
                <label htmlFor='gender' className='text-xs form-label'>Gender</label>
                <div>
                <select id='gender' className='modal-i' {...register('gender')}>
                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                    <option value={'Other'}>Other</option>
                </select>
                </div>
            </div>
            
        </form>
    )
}