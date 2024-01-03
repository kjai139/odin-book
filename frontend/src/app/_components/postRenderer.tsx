import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { EditorContent, generateHTML, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useMemo, useRef, useState } from "react"
import ExpandBtnTT from "./buttons/tiptapExpandBtn"



interface PostRendererProps {
    post: any
}


export default function PostRenderer ({post}:PostRendererProps) {
    let json = post
    if (typeof json === 'string') {
        json = JSON.parse(json)
    }

    const editorRef = useRef<HTMLDivElement>(null)

    const [isPostExpanded, setIsPostExpanded] = useState(false)

    const editor = useEditor({
        content: json,
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                autolink: false,
            })
        ],
        editable: false,
       
        
        
    })

    useEffect(() => {
        if (!editor) {
            return undefined
        }
        /* console.log(editor) */
        
    }, [editor])

    


    return (
        <div ref={editorRef} className={`${isPostExpanded ? 'expanded' : 'expanded-false'}`}>
            <EditorContent editor={editor} className="editor-p"></EditorContent>
            {editorRef.current && editorRef.current.clientHeight !== editorRef.current.children[0]?.scrollHeight ? 
            <ExpandBtnTT refEle={editorRef} isExpanded={isPostExpanded} setIsExpanded={setIsPostExpanded}></ExpandBtnTT> :
            null
            }
            
        </div>
    )

    
}