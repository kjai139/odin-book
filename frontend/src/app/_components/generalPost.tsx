import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatUsername, formatDate } from "../_utils/formatStrings"
import { BsThreeDots } from "react-icons/bs"
import HTMLRender from "./home/htmlRender"
import ReactPlayer from "react-player"
import LikeDislikeCmt from "./buttons/likeDislikeCmt"
import { Post } from "../../../interfaces/post.interface"
import { useState } from "react"
import PostModal from "../_modals/postModal"

interface GeneralPostProps {
    post: Post[],
    setPost: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function GeneralPost ({post, setPost}:GeneralPostProps) {

    const [isMenuExpanded, setIsMenuExpanded] = useState(false)

    const toggleExpandBtn = () => {
        setIsMenuExpanded(prev => !prev)
    }

    


    return (
        <>
        {post && post[0] &&
            
                <div className="post-cont rounded shadow">
                <div className='flex gap-2 p-2 items-center'>
                {post[0].author.image ?
                <div className='relative post-pfp-cont rounded-full overflow-hidden'>
                <Image src={post[0].author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic' priority={true}></Image>
                </div>
                :
                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                }
                <div>
                    <p className='text-sm'>{formatUsername(post[0].author.name)}</p>
                    <p className='date-txt'>{formatDate(post[0].createdAt)}</p>
                </div>
                <div className="ml-auto relative"> 
                <button className="post-menu p-2" onClick={toggleExpandBtn}>
                    <BsThreeDots size={20}></BsThreeDots>
                </button>
                    <PostModal isExpanded={isMenuExpanded}></PostModal>
                </div>

                </div>
                <HTMLRender editorOBJ={post[0].body}></HTMLRender>
                {post && post[0] &&
                                post[0].videos.map((video:any) => {
                                    return (
                                        <ReactPlayer key={video._id} url={video.url} controls={true} width="100%" height="auto"></ReactPlayer>
                                    )
                                })
                }
                                <div className="p-2 text-sm">
                                    <p>{`${post[0].likes} likes and ${post[0].dislikes} dislikes.`}</p>
                                </div>
                                <LikeDislikeCmt thePost={post[0]} setRenderState={setPost}></LikeDislikeCmt>
                
                </div>
            
            }
            </>
    )
}