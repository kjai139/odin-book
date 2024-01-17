import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import axiosInstance from '../../../../axios'
import { Post } from "../../../../interfaces/post.interface"

interface LikeDisLikeCmtProps {
    postId: string,
    setRenderState: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function LikeDislikeCmt ({postId, setRenderState}:LikeDisLikeCmtProps) {


    const likePost = async () => {
        try {
            const response = axiosInstance.post('/api/post/likePost', {
                postId: postId
            }, {
                withCredentials: true
            })




        } catch (err) {
            console.error(err)
        }
    }

    const dislikePost = async () => {
        try {
            const response = axiosInstance.post('/api/post/dislikePost', {
                postId: postId
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
            <div className="flex justify-around">
                <button className="post-icons">
                    <p>Like</p>
                    <AiOutlineLike></AiOutlineLike>

                </button>
                <button className="post-icons">
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