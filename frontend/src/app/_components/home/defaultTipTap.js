' use client'


import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { RiBold, RiItalic } from 'react-icons/ri'


const DefaultTiptap = ({setPost}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                
                heading: {
                    levels: [1, 2, 3],
                }
               
            }),
            Placeholder.configure({
                placeholder: 'Write something...'
            })
            
        ]
    })

    const handleBoldClick = () => {
        editor.commands.toggleBold()
    }

    const handleItalics = () => {
        editor.commands.toggleItalic()
    }

    return (
        <div className='vtt rounded-xl'>
            <div className='vtt-menu p-2 flex gap-2 flex-wrap'>
                <button onClick={handleBoldClick} className={editor && editor.isActive('bold') ? 'tt-active' : ''}>
                    <RiBold></RiBold>
                </button>
                <button onClick={handleItalics} className={editor && editor.isActive('italic') ? 'tt-active' : ''}>
                    <RiItalic></RiItalic>
                </button>

            </div>
            <EditorContent editor={editor} style={{
                
                minHeight: '5rem',
                padding: '.75rem',

                
                
            }}></EditorContent>
            
        </div>

    )
}

export default DefaultTiptap