
import { EditorContent, generateHTML, useEditor, EditorContentState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo } from "react";


interface HTMLRenderProps {
    editorOBJ: any,
}



export default function HTMLRender ({editorOBJ}:HTMLRenderProps) {


   const editor = useEditor({
        editable: false,
        extensions: [StarterKit],
        content: editorOBJ
        
   })

   useEffect(() => {
    if (!editor) {
        return undefined
    } else {
        if (editorOBJ) {
            editor.commands.setContent(editorOBJ)
        }
        
    }
   }, [editor,editorOBJ])

   return (
        <EditorContent editor={editor}></EditorContent>
   )
}