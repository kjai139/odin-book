import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import TipTap from './tiptap'
import { BsPersonCircle } from 'react-icons/bs'
import { formatUsername, formatDate } from '../_utils/formatStrings'
import PostRenderer from './postRenderer'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../axios'
import { Post } from '../../../interfaces/post.interface'

export default function UserPosts() {

    const { user } = useAuth()

    const [recentPosts, setRecentPosts] = useState<Post[]>()

    useEffect(() => {
        const getPostsOnly = async () => {
            try {
                const response = await axiosInstance.get('/api/postsOnly/get', {
                    withCredentials: true
                })

                if (response.data.recentPosts) {
                    console.log('recent post with no vids:', response.data.recentPosts)
                    setRecentPosts(response.data.recentPosts)
                }
            } catch (err) {
                console.error(err)
            }
        }

        getPostsOnly()
    }, [])




    return (
        <div className='dashb-mid-block flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
                <h3>Write a post</h3>
                <TipTap type={'post'}></TipTap>
                <h3>Your recent Posts</h3>
                <div className='flex flex-col gap-2'>
                {recentPosts && recentPosts.map((node) => {

                    


                    return (
                        <div key={node._id} className='post-cont rounded p-2 shadow'>
                            
                            <div className='flex gap-2 p-2 items-center'>
                                {node.author.image ?
                                <div className='relative post-pfp-cont'>
                                <Image src={node.author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                                </div>
                                :
                                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                                }
                                <div>
                                    <p className='text-sm'>{formatUsername(node.author.name)}</p>
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
            
        </div>
    )
}