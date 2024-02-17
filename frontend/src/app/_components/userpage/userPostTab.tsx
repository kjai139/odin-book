import UserBio from "../home/userBio";
import axiosInstance from '../../../../axios'
import { Post } from "../../../../interfaces/post.interface";
import PostRenderer from "../postRenderer";
import ReactPlayer from "react-player";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { formatUsername, formatDate } from "@/app/_utils/formatStrings";

interface UserPostTabProps {
    bio: string,
    recentPosts: Post[]
}


export default function UserPostTab ({bio, recentPosts}:UserPostTabProps) {




    return (
        <div className="flex flex-col up-content-cont">
            <div className="flex gap-4">
                {/* left */}
                <div className="flex flex-col flex-1">
                <div className="vtt rounded p-2">
                <span>
                    <h3 className="border-b border-CED0D4">Intro</h3>
                </span>
                    <div>
                    { bio ? 
                    <UserBio bio={bio} mode={'up'}></UserBio> 
                    :
                    <div className="py-2">
                        <p>User does not have a bio.</p>
                    </div>
                    }
                    </div>
                </div>
                </div>

                {/* right */}
                <div className="flex flex-col flex-2 gap-4 min-w-0">
                    {/* <div className="vtt rounded p-2 flex flex-col gap-2">
                  
                    <span className="border-b border-CED0D4">
                        <h3>Recent Posts</h3>
                    </span> 
                    </div> */}
        
                    {recentPosts && recentPosts.length !== 0 ? recentPosts.map((post) => {
                        return (
                            
                            <div key={post._id} className="vtt rounded">
                                <div className='flex gap-2 p-2 items-center'>
                                {post.author.image ?
                                <div className='relative post-pfp-cont'>
                                <Image src={post.author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                                </div>
                                :
                                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                                }
                                <div>
                                    <p className='text-sm'>{formatUsername(post.author.name)}</p>
                                    <p className='date-txt'>{formatDate(post.createdAt)}</p>
                                </div>

                                </div>
                                <PostRenderer post={post.body}></PostRenderer>
                                {post.videos && post.videos.map((vid) => {
                                    return (
                                        <ReactPlayer key={vid._id} url={vid.url} controls={true} width="100%" height="auto"></ReactPlayer>
                                    )
                                })}
                            </div>
                        )
                    }) : 
                    <span className="vtt rounded p-4">
                        <p>User has no posts.</p>
                    </span>
                    }
                    

                    

                </div>

            </div>
            

        </div>
    )
}