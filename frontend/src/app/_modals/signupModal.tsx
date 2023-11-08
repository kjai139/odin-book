
import axiosInstance from '../../../axios'
import { AxiosError } from "axios"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import CloseButton from '../_components/icons/closeBtn.svg'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input'

interface SignupModalProps {
    closeModal: () => void
}

export default function SignUpModal({closeModal}:SignupModalProps) {

    type Gender = 'Male' | 'Female' | 'Other'
    
    const schema = yup.object({
        email: yup.string().required('This field is required'),
        password: yup.string().required('This field is required').min(6, 'Password must have min length of 6 characters').matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter').matches(/^(?=.*[A-Z])/, 'must contain at least one uppercase letter').matches(/^(?=.*[!@#$%^&()_+-])/, 'must have at least one special character').max(20, 'Password cannot have more than 20 characters'),
        firstName: yup.string().required('first name is required'),
        lastName: yup.string().required('last name is required'),
        Phone: yup.string().optional().test('isValid', 'Invalid number', (value) => {
            if (value !== undefined) {
                return isPossiblePhoneNumber(value)
            }
            return true
        }),
        // birthDate: yup.date().required('birthday is required'),
        gender: yup.string().oneOf(['Male', 'Female', 'Other']).required('gender is required')
    })
    type Inputs = {
        email:string,
        password: string,
        firstName: string,
        lastName: string,
        Phone:string,
        // birthDate: Date,
        gender: Gender,
        

        
    }

    const {
        register,
        handleSubmit,
        formState,
        control,
        formState: {
            errors
        }
    
    } = useForm<Inputs>({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data:Inputs) => {
        console.log(data)
        console.log(errors)
        
    }



    return (
        <form className='flex flex-col gap-2 rounded bg-white max-w-modal-i p-4' onSubmit={handleSubmit(onSubmit)}>
            
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
                <div className='relative'>
                <input className='modal-i' {...register('firstName')} type='text' placeholder='Firstname'></input>
                    { errors.firstName?.message &&
                    <p className='signup-error arr-right'>{errors.firstName?.message}</p>
                    }
                    
                
                    
                </div>
                <div className='relative'>
                <input className='modal-i' {...register('lastName')} type='text' placeholder='Lastname'></input>

                    { errors.lastName?.message &&
                        <p className='signup-error arr-left'>{errors.lastName?.message}</p>
                    }
                
                    
                </div>
            </div>
            <div>
                <div className='relative'>
                <input className='modal-i' {...register('password')} type='password' placeholder='Enter new password'></input>
                {errors.password?.message &&
                <p className='signup-error arr-right'>
                    {errors.password?.message}
                </p>
                }
                </div>
            </div>
            <div>
                <div className='relative'>
                <input className='modal-i' {...register('email')} type='email' placeholder='Enter your email'></input>
                {errors.email?.message &&
                <p className='signup-error arr-right'>
                    {errors.email?.message}
                </p>
                }
                </div>
            </div>
            </div>
            <div className='flex flex-col relative'>
                <label className='text-xs form-label' htmlFor='Phone'>Phone number</label>
                <Controller
                control={control}
                name='Phone'
                render={({field: {onChange, value }}) => (
                    <PhoneInput 
                    onChange={onChange}
                    
                    value={value}
                    // error={value != undefined && (isPossiblePhoneNumber(value) ? undefined : 'invalid number')}
                    placeholder="Optional phone number"
                    defaultCountry='US'
                    id='Phone'
                    
                    >

                    </PhoneInput>
                )

                }
                ></Controller>
                {errors.Phone?.message &&
                <p className='signup-error arr-right'>
                    {errors.Phone?.message}
                </p> }
                
                
            </div>
            <div className='flex flex-col'>
                <label htmlFor='gender' className='text-xs form-label'>Gender</label>
                <div className='relative'>
                <select id='gender' className='modal-i' {...register('gender')}>
                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                    <option value={'Other'}>Other</option>
                </select>
                {errors.gender?.message &&
                <p className='signup-error arr-right'>
                    {errors.gender?.message}
                </p>
                }
                </div>
            </div>
            <div className='flex justify-center align-center'>
                <button type='submit'>Create account</button>
            </div>
            
        </form>
    )
}