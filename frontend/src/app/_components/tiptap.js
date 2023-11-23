'use client'


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import {
    RiBold,
    RiItalic,
    RiImageAddFill,
    RiH1,
    RiH2,
    RiH3,
    RiLinkUnlink,
    RiLink,
    RiCodeBoxLine,
    RiDoubleQuotesL,
    RiListOrdered,
    RiListUnordered,
    RiParagraph
} from 'react-icons/ri'


const TipTap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        
        
    })

    const handleBoldClick = () => {
        editor.chain().focus().toggleBold().run()
    }

    const handleCreatePost = () => {
        const json = editor.getJSON()
        console.log('post json:', json)
    }

    return (
        <div className='tt-cont rounded'>
            <div className='tt-menu p-2 flex gap-2 flex-wrap'>
                <button onClick={handleBoldClick} className={editor.isActive('bold') ? 'tt-active' : undefined}>
                    <RiBold></RiBold>
                </button>
                <button>
                    <RiItalic></RiItalic>
                </button>
                <button>
                    <RiH1></RiH1>
                </button>
                <button>
                    <RiH2></RiH2>
                </button>
                <button>
                    <RiH3></RiH3>
                </button>
                <button>
                    <RiParagraph></RiParagraph>
                </button>
                <button>
                    <RiImageAddFill></RiImageAddFill>
                </button>
                <button>
                    <RiLink></RiLink>
                </button>
                <button>
                    <RiLinkUnlink></RiLinkUnlink>
                </button>
                <button>
                    <RiCodeBoxLine></RiCodeBoxLine>
                </button>
                <button>
                    <RiDoubleQuotesL></RiDoubleQuotesL>
                </button>
                <button>
                    <RiListUnordered></RiListUnordered>
                </button>
                <button>
                    <RiListOrdered></RiListOrdered>
                </button>

            </div>
            
            <EditorContent editor={editor}></EditorContent>
            
            <div className='flex justify-end'>
                <div className='p-2'>
                    <button onClick={handleCreatePost}>Create post</button>
                </div>
            </div>
        </div>
    )
}


export default TipTap