import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import TipTap from './tiptap'
import { BsPersonCircle } from 'react-icons/bs'
import { formatUsername, formatDate } from '../_utils/formatStrings'

export default function UserPosts() {

    const { user } = useAuth()

    




    return (
        <div className='dashb-mid-block'>
            <div>
                <h1>Recent Posts</h1>
                {user?.posts.map((node) => {

                    


                    return (
                        <div key={node._id}>
                            <div className='flex gap-2'>
                                {user.image ?
                                <Image src={user.image} alt='user pic'></Image>
                                :
                                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                                }
                                <div>
                                    <p>{formatUsername(user.name)}</p>
                                    <p>{formatDate(node.createdAt)}</p>
                                </div>

                            </div>
                            <div>

                            </div>
                            <div>
                            </div>

                        </div>
                    )
                })}
            </div>
            <TipTap type={'post'}></TipTap>
        </div>
    )
}