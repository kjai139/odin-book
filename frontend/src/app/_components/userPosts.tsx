import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import TipTap from './tiptap'
import { BsPersonCircle } from 'react-icons/bs'
import { formatUsername, formatDate } from '../_utils/formatStrings'
import PostRenderer from './postRenderer'

export default function UserPosts() {

    const { user } = useAuth()

    




    return (
        <div className='dashb-mid-block flex flex-col gap-4'>
            <div className='flex flex-col'>
                <h1>Recent Posts</h1>
                <div className='flex flex-col gap-2'>
                {user?.posts.map((node) => {

                    


                    return (
                        <div key={node._id} className='post-cont rounded p-2 shadow'>
                            
                            <div className='flex gap-2 p-2 items-center'>
                                {user.image ?
                                <Image src={user.image} alt='user pic'></Image>
                                :
                                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                                }
                                <div>
                                    <p className='text-sm'>{formatUsername(user.name)}</p>
                                    <p className='date-txt'>{formatDate(node.createdAt)}</p>
                                </div>

                            </div>
                            
                            <PostRenderer post={node?.body}></PostRenderer>

                            
                            <div>
                            </div>
                           

                        </div>
                    )
                })}
                </div>
            </div>
            <TipTap type={'post'}></TipTap>
        </div>
    )
}