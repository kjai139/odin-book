'use client'


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'


const TipTap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello Wrodl!</p>'
    })

    return (
        <EditorContent editor={editor}></EditorContent>
    )
}


export default TipTap