import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { RiBold, RiItalic } from 'react-icons/ri'
import axiosInstance from '../../../../axios'
import { useEffect, useState } from "react";

const limit = 280

interface UserBioProps {

    bio: any,
    mode: any
}

export default function UserBio ({bio, mode}:UserBioProps) {

    

    const [userBio, setUserBio] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Update your bio...'
            }),
            CharacterCount.configure({
                limit: limit
            })
            
        ],
        editable: userBio ? false : true
    })

    useEffect(() => {
        if (bio && editor) {
            editor.commands.setContent(bio)
            editor.setEditable(false)
            
        }
    }, [editor, bio])

    useEffect(() => {
        if (editor && isEditable) {
            editor.setEditable(true)
        } else if (editor && !isEditable) {
            editor.setEditable(false)
        }
    }, [isEditable])

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
        if (!editor.isEmpty) {
            if (!checkIfcontentEmpty(content)){
                try {
                    setIsLoading(true)
                    const response = await axiosInstance.post('/api/user/updateBio', {
                        content: content
                    }, {
                        withCredentials: true
                    })
        
                    if (response.data.updatedBio) {
                        setIsLoading(false)
                        console.log(JSON.parse(response.data.updatedBio))
                        setIsEditable(false)
                    }
                } catch (err) {
                    setIsLoading(false)
                    console.error(err)
                }
            }
            
        } else {
            console.log('editor is empty')
        }
        
    }

   

    const checkIfcontentEmpty = (block:any) => {
        if (!block || !block.type) {
            return true
        }
        
        /* if (block.type in BLOCK_TYPE_OBJECTS) {
            return BLOCK_TYPE_OBJECTS[block.type](block)
        } */

        if ('text' in block) {
            console.log('text found in content:', block.text, !block.text?.trim())
            return !block.text?.trim()
        }
        
        return block.content ? block.content.every((_block:any) => checkIfcontentEmpty(_block)) : true
    }

    




    return (
        <div className='vtt rounded flex flex-col h-full justify-between'>
            {isLoading && 
            <div className="overlay-cmt"></div>
            }
        {isEditable && <div className={`vtt-menu p-2 flex gap-2 flex-wrap`}>
            <button onClick={handleBoldClick} className={editor && editor.isActive('bold') ? 'tt-active' : ''}>
                <RiBold></RiBold>
            </button>
            <button onClick={handleItalics} className={editor && editor.isActive('italic') ? 'tt-active' : ''}>
                <RiItalic></RiItalic>
            </button>

        </div>}
        {
            mode === 'up' &&
            <span className="p-2">
                <h3 className="border-b border-CED0D4">Intro</h3>
            </span>
        }
        <EditorContent editor={editor} style={{
            
            minHeight: '5rem',
            padding: '.75rem',

            
            
        }}></EditorContent>
       { isEditable && <span className='num-count flex justify-end'>
        {editor.storage.characterCount.characters()}/{limit} characters
        </span>}
        { mode !== 'up' && <div className="flex justify-end">
        <button className="py-1 px-4 bg-blue-500 text-white shadow rounded-lg" onClick={isEditable ? handleUpdateBio : () => setIsEditable(true)}>{isEditable ? `Update bio` : 'Edit bio'}</button>
        </div>
       }
        
        </div>
    )
}