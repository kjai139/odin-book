
import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, generateHTML, useEditor, EditorContentState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ExpandBtnTT from "../buttons/tiptapExpandBtn";

interface HTMLRenderProps {
    editorOBJ: any,
}





export default function HTMLRender ({editorOBJ}:HTMLRenderProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    


   const editor = useEditor({
        editable: false,
        extensions: [StarterKit],
        content: editorOBJ
        
   })
   const [isOverFlowed, setIsOverflowed] = useState(false)
   const [isPostExpanded, setIsPostExpanded] = useState(false)

   

   useEffect(() => {
    if (!editor) {
        return undefined
    } else {
        if (editorOBJ) {
            if (typeof editorOBJ === 'string') {
                editorOBJ = JSON.parse(editorOBJ)
            }
            editor.commands.setContent(editorOBJ)
            
        }
        
    }
   }, [editor,editorOBJ])

   return (
        <div ref={editorRef} className={`${isPostExpanded ? 'expanded' : 'expanded-false'}`}>
        <EditorContent editor={editor} className={`editor-p`}>

        </EditorContent>
        {editorRef.current && editorRef.current.clientHeight !== editorRef.current.children[0]?.scrollHeight ? 
        <ExpandBtnTT refEle={editorRef} isExpanded={isPostExpanded} setIsExpanded={setIsPostExpanded}></ExpandBtnTT> :
        null
        }
        </div>
   )
}