import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { RiBold, RiItalic } from 'react-icons/ri'
import { useAuth } from "../../../../context/authContext";
import axiosInstance from '../../../../axios'
import { useState } from "react";

const limit = 280

interface UserBioProps {
    mode: 'display' | 'writer'
}

export default function UserBio ({mode}:UserBioProps) {

    const { user } = useAuth()

    const [userBio, setUserBio] = useState()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Update your bio...'
            }),
            CharacterCount.configure({
                limit: limit
            })
            
        ]
    })

    if (!editor) {
        return null
    }

    const handleBoldClick = () => {
        editor.commands.toggleBold()
    }

    const handleItalics = () => {
        editor.commands.toggleItalic()
    }

    const handleUpdateBio = async () => {
        const content = editor.getJSON()
        try {
            const response = await axiosInstance.post('/api/user/updateBio', {
                content: content
            })

            if (response.data.updatedBio) {
                const bioJson = JSON.parse(response.data.updateBio)
                setUserBio(bioJson)
            }
        } catch (err) {
            console.error(err)
        }
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
        {editor.storage.characterCount.characters()}/{limit} characters
        </span>
        <div className="flex justify-end">
        <button className="py-1 px-4 bg-blue-500 text-white shadow rounded-lg">Update bio</button>
        </div>
       
        
        </div>
    )
}