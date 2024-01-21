import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import axiosInstance from '../../../../axios'
import { Post } from "../../../../interfaces/post.interface"
import { useState } from "react"
import CommentModal from "@/app/_modals/commentModal"

interface LikeDisLikeCmtProps {
    thePost: Post,
    setRenderState: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function LikeDislikeCmt ({thePost, setRenderState}:LikeDisLikeCmtProps) {

    const [isCmtModalOpen, setIsCmtModalOpen] = useState(false)


    const likePost = async () => {
        try {
            const response = await axiosInstance.post('/api/post/likePost', {
                postId: thePost._id,
                
            }, {
                withCredentials: true
            })
            if (response.data.updatedPost) {
                setRenderState((prev) => prev.map((post) => (post._id === thePost._id ? response.data.updatedPost : post)))
                console.log(`post ${thePost._id} updated in likes`)
                
            }
            




        } catch (err) {
            console.error(err)
        }
    }

    const dislikePost = async () => {
        try {
            const response = await axiosInstance.post('/api/post/dislikePost', {
                postId: thePost._id,
                
            }, {
                withCredentials: true
            })

            if (response.data.updatedPost) {
                setRenderState((prev) => prev.map((post) => post._id === thePost._id ? response.data.updatedPost : post ))
            }
            

        } catch (err) {
            console.error(err)
        }
    }

    

    const displayCommentModal = () => {

    }

    return (
        <div className="">
            <div className="flex justify-around mb-2 like-cont">
                <button className={`post-icons ${thePost.didUserLike ? 'p-liked' : 'p-blank'}`} onClick={likePost}>
                    <p>Like</p>
                    <AiOutlineLike></AiOutlineLike>

                </button>
                <button className={`post-icons ${thePost.didUserDislike ? 'p-disliked' : 'p-blank'}`} onClick={dislikePost}>
                    <p>Dislike</p>
                    <AiOutlineDislike></AiOutlineDislike>

                </button>
                <button className="post-icons" onClick={() => setIsCmtModalOpen(!isCmtModalOpen)}>
                    <p>Comment</p>
                    <FaRegComment></FaRegComment>

                </button>
                
            </div>
            
            <CommentModal thePost={thePost} setRenderState={setRenderState} isShowing={isCmtModalOpen}></CommentModal>
            
        </div>
    )
}