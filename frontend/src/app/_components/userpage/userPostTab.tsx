import UserBio from "../home/userBio";
import axiosInstance from '../../../../axios'
import { Post } from "../../../../interfaces/post.interface";
import PostRenderer from "../postRenderer";
import ReactPlayer from "react-player";

interface UserPostTabProps {
    bio: string,
    recentPosts: Post[]
}


export default function UserPostTab ({bio, recentPosts}:UserPostTabProps) {




    return (
        <div className="flex flex-col up-content-cont">
            <div className="flex">
                {/* left */}
                <div className="flex flex-col flex-1">
                    <UserBio bio={bio} mode={'up'}></UserBio>

                </div>

                {/* right */}
                <div className="flex flex-col flex-1">
                  
                    <span>
                        <h3>Recent Posts</h3>
                    </span> 
        
                    {recentPosts ? recentPosts.map((post) => {
                        return (
                            <div key={post._id}>
                                <PostRenderer post={post.body}></PostRenderer>
                                {post.videos && post.videos.map((vid) => {
                                    return (
                                        <ReactPlayer key={vid._id} url={vid.url}></ReactPlayer>
                                    )
                                })}
                            </div>
                        )
                    }) : 
                    <span>
                        <p>User has no posts.</p>
                    </span>
                    }

                </div>

            </div>

        </div>
    )
}