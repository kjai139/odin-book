import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatUsername, formatDate } from "../_utils/formatStrings"
import { BsThreeDots } from "react-icons/bs"
import HTMLRender from "./home/htmlRender"
import ReactPlayer from "react-player"
import LikeDislikeCmt from "./buttons/likeDislikeCmt"
import { Post } from "../../../interfaces/post.interface"
import { useEffect, useState } from "react"
import PostModal from "../_modals/postModal"
import { useAuth } from "../../../context/authContext"

interface GeneralPostProps {
    post: Post,
    setPost: any,
    mode: 'single' | 'array',
    modalDeletePost: (id:string) => Promise<void>,
}

export default function GeneralPost ({post, setPost, mode, modalDeletePost}:GeneralPostProps) {

    const [isMenuExpanded, setIsMenuExpanded] = useState(false)

    const { user } = useAuth()

    const toggleExpandBtn = () => {
        setIsMenuExpanded(prev => !prev)
    }

    useEffect(() => {
        if (post) {
            setIsMenuExpanded(false)
        }
    }, [post])

    


    return (
        <>
        {post &&
            
                <div className="post-cont rounded shadow">
                <div className='flex gap-2 p-2 items-center'>
                {post.author.image ?
                <div className='relative post-pfp-cont rounded-full overflow-hidden'>
                <Image src={post.author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic' priority={true}></Image>
                </div>
                :
                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                }
                <div>
                    <p className='text-sm'>{formatUsername(post.author.name)}</p>
                    <p className='date-txt'>{formatDate(post.createdAt)}</p>
                </div>
                <div className="ml-auto relative"> 
                <button className={`post-menu p-2 ${isMenuExpanded && 'pm-expanded'}`} onClick={toggleExpandBtn}>
                    <BsThreeDots size={20}></BsThreeDots>
                </button>
                    <PostModal isExpanded={isMenuExpanded} postId={post.author._id} userId={user._id} modalDeletePost={() => modalDeletePost(post._id)}></PostModal>
                </div>

                </div>
                <HTMLRender editorOBJ={post.body}></HTMLRender>
                {post &&
                                post.videos.map((video:any) => {
                                    return (
                                        <ReactPlayer key={video._id} url={video.url} controls={true} width="100%" height="auto"></ReactPlayer>
                                    )
                                })
                }
                                <div className="p-2 text-sm">
                                    <p>{`${post.likes} likes and ${post.dislikes} dislikes.`}</p>
                                </div>
                                <LikeDislikeCmt thePost={post} setRenderState={setPost} mode={mode}></LikeDislikeCmt>
                
                </div>
            
            }
            </>
    )
}