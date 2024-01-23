import { Comment } from "../../../interfaces/comment.interface"
import { useEffect, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatUsername } from "../_utils/formatStrings"

interface CommentRendererProps {
    comment: Comment
}


export default function CommentRenderer ({comment}:CommentRendererProps) {
    
    

    const editor = useEditor({
        content: comment.body,
        extensions: [
            StarterKit,
        ],
        editable: false,
       
        
        
    })

    useEffect(() => {
        if (!editor) {
            return undefined
        } else {
            if (comment && comment.body) {
                if (typeof comment.body === 'string') {
                    comment = JSON.parse(comment.body)
                }
                editor.commands.setContent(comment.body)
                
            }
            
        }
       }, [editor,comment])

    return (
        <> 
            <div className='flex gap-2 p-2 items-center'>
                {comment && comment.author?.image ?
                <div className='relative post-pfp-cont rounded-full overflow-hidden'>
                    <Image src={comment.author.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                </div>
                :
                <BsPersonCircle className="backup-user-img" size={40}></BsPersonCircle> 
                }
                <div>
                    { comment && comment.author && <p className='text-sm'>{formatUsername(comment.author.name)}</p>}
                    
                </div>

                </div>
            <EditorContent editor={editor} className={`editor-p`} />
        </>
    )
}