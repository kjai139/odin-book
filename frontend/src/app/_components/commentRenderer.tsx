import { Comment } from "../../../interfaces/comment.interface"
import { useEffect, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "next/image"
import { BsPersonCircle } from "react-icons/bs"
import { formatDate, formatUsername } from "../_utils/formatStrings"

interface CommentRendererProps {
    comment: Comment
}


export default function CommentRenderer ({comment}:CommentRendererProps) {
    
    

    const editor = useEditor({

        extensions: [
            StarterKit,
        ],
        editable: false,
       
        
        
    })

    useEffect(() => {
        if (!editor) {
            return undefined
        } else {
            if (editor && comment && comment.body) {
                let parsedComment
                if (typeof comment.body === 'string') {
                    parsedComment = JSON.parse(comment.body)
                    
                }
                editor.commands.setContent(parsedComment)
                
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
                    <div className="flex items-center gap-1">
                    { comment && comment.author && <p className='text-xs font-bold'>{formatUsername(comment.author.name)}</p>}
                    { comment && comment.createdAt &&
                    <p className="date-txt">{formatDate(comment.createdAt)}</p> 
                    }
                    </div>
                    <EditorContent editor={editor} className={`editor-p`} />
                </div>

                </div>
            
        </>
    )
}