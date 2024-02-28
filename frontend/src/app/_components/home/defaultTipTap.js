' use client'


import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { RiBold, RiItalic } from 'react-icons/ri'

const limit = 300

const DefaultTiptap = ({setPost, resetForm, setResetForm}) => {

    const [characters, setCharacters] = useState(0)
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                
                heading: {
                    levels: [1, 2, 3],
                }
               
            }),
            Placeholder.configure({
                placeholder: 'Write something...'
            }),
            CharacterCount.configure({
                limit:limit,
                mode: 'nodeSize'
            })
            
            
        ],
        onUpdate: ({editor}) => {
            setPost(editor)
            setCharacters(editor.storage.characterCount.characters())
        }
    })

    const handleBoldClick = () => {
        editor.commands.toggleBold()
    }

    const handleItalics = () => {
        editor.commands.toggleItalic()
    }
    useEffect(() => {
        if (resetForm && editor) {
            editor.commands.clearContent()
            setResetForm(false)
        }

    }, [resetForm])

    if (!editor) {
        return null
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
            <span className='num-count flex justify-end'>
            {characters}/{limit}
            </span>
           
            
        </div>

    )
}

export default DefaultTiptap