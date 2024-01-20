import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import { BiSolidRightArrow } from 'react-icons/bi'
import Placeholder from '@tiptap/extension-placeholder'
import axiosInstance from '../../../axios'
import { Post } from "../../../interfaces/post.interface"

interface CommentModalProps {
    thePost: Post,
    setRenderState: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function CommentModal ({thePost, setRenderState}:CommentModalProps) {

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

    const postComment = async () => {
        try {
            const response = await axiosInstance.post('/api/comments/post', {
                content: editor?.getJSON()
            }, {
                withCredentials: true
            })

            if (response.data.updatedPost) {

            }

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div className="cmt-modal-cont rounded-lg">
            <EditorContent editor={editor}></EditorContent>
            <div className="flex justify-end">
                <button className="p-2">
                <BiSolidRightArrow style={{
                    color: 'gray',
                }}></BiSolidRightArrow>
                </button>
            </div>

        </div>
    )
}