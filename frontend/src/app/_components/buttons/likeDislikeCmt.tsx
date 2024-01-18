import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import axiosInstance from '../../../../axios'
import { Post } from "../../../../interfaces/post.interface"
import { useState } from "react"

interface LikeDisLikeCmtProps {
    postId: string,
    setRenderState: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function LikeDislikeCmt ({postId, setRenderState}:LikeDisLikeCmtProps) {

    const [isPostLiked, setIsPostLiked ] = useState(false)
    const [isPostDisliked, setIsPostDisliked ] = useState(false)
    const likePost = async () => {
        try {
            const response = await axiosInstance.post('/api/post/likePost', {
                postId: postId,
                action: isPostLiked ? 'unlike' : 'like'
            }, {
                withCredentials: true
            })
            if (response.data.updatedPost) {
                setRenderState((prev) => prev.map((post) => (post._id === postId ? response.data.updatedPost : post)))
                console.log(`post ${postId} updated in likes`)
                setIsPostDisliked(false)
                setIsPostLiked(true)
            }
            




        } catch (err) {
            console.error(err)
        }
    }

    const dislikePost = async () => {
        try {
            const response = axiosInstance.post('/api/post/dislikePost', {
                postId: postId,
                action: isPostDisliked ? 'undislike' : 'dislike'
            }, {
                withCredentials: true
            })

        } catch (err) {
            console.error(err)
        }
    }

    

    const addCommentModal = () => {

    }

    return (
        <div>
            <div className="flex justify-around mb-2 like-cont">
                <button className={`post-icons ${isPostLiked ? 'p-liked' : 'p-blank'}`} onClick={likePost}>
                    <p>Like</p>
                    <AiOutlineLike></AiOutlineLike>

                </button>
                <button className={`post-icons ${isPostDisliked ? 'p-disliked' : 'p-blank'}`} onClick={dislikePost}>
                    <p>Dislike</p>
                    <AiOutlineDislike></AiOutlineDislike>

                </button>
                <button className="post-icons">
                    <p>Comment</p>
                    <FaRegComment></FaRegComment>

                </button>
            </div>
        </div>
    )
}