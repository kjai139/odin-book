import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import { BiSolidRightArrow } from 'react-icons/bi'
import Placeholder from '@tiptap/extension-placeholder'
import axiosInstance from '../../../axios'
import { Post } from "../../../interfaces/post.interface"
import Image from "next/image"
import { useAuth } from "../../../context/authContext"
import { BsPersonCircle } from 'react-icons/bs'

interface CommentModalProps {
    thePost: Post,
    setRenderState: React.Dispatch<React.SetStateAction<Post[]>>,
    isShowing: boolean
}

export default function CommentModal ({thePost, setRenderState, isShowing}:CommentModalProps) {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write a comment...'
            })
        ],
        editorProps: {
            attributes: {
                class: 'cmt-editor p-2'
            }
        }
    })

    const { user } = useAuth()

    const postComment = async () => {
        try {
            const response = await axiosInstance.post('/api/comment/post', {
                content: editor?.getJSON(),
                postId: thePost._id
            }, {
                withCredentials: true
            })

            if (response.data.updatedPost) {
                console.log('updated post w comment:', response.data.updatedPost)
            }

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <>
        <div className={`flex cmt-modal-pfp ${isShowing && 'show'}`}>
            
        {user && user.image ?
                <div>
                <div className='relative cmt-pfp-cont rounded-full overflow-hidden ml-1 mr-2 flex-shrink-0'>
                <Image src={user.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                </div>
                </div>
                :
                <BsPersonCircle className="backup-user-img" size={26}></BsPersonCircle> 
        
        }
        
        <div className={`cmt-modal-cont rounded mr-2 mb-2 w-full min-w-0 ${isShowing && 'show'}`}>
            {/* set min-width to 0 to prevent overflow.  */}
            
            <EditorContent editor={editor}></EditorContent>
            <div className="flex justify-end">
                <button className="p-2" type="button" onClick={postComment}>
                <BiSolidRightArrow style={{
                    color: 'gray',
                }}></BiSolidRightArrow>
                </button>
            </div>

        </div>
        </div>
        </>
    )
}