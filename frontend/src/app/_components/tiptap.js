'use client'


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
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
import { useCallback, useRef, useState } from 'react'


const TipTap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                }
            }),
            Image,
            Link.configure({
                autolink: false,
            })
        
        ],
        
        
    })

    const [linkUrl, setLinkUrl] = useState('')
    const [displayLinkInput, setDisplayLinkInput] = useState(false)

    const imageRef = useRef(null)
    const urlInputRef = useRef(null)

    const handleBoldClick = () => {
        editor.chain().focus().toggleBold().run()
    }

    const handleCreatePost = () => {
        const json = editor.getJSON()
        console.log('post json:', json)
    }

    const handleItalics = () => {
        editor.chain().focus().toggleItalic().run()
    }

    const handleHeadings = (level) => {
        switch(level) {
            case 1: editor.chain().focus().toggleHeading({level : 1}).run()
            break;
            case 2: editor.chain().focus().toggleHeading({level : 2}).run()
            break;
            case 3: editor.chain().focus().toggleHeading({level : 3}).run()
            break;
        }
        
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        let url = urlInputRef.current.value

        if (url === null) {
            return
        }
        //empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
        }
        //update link
        if (url.startsWith('https://')) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url}).run()
        } else {
            url = 'https://' + url
            editor.chain().focus().extendMarkRange('link').setLink({ href: url}).run()
        }

        setDisplayLinkInput(false)
        
        
        
    }, [editor])

    const handleUnsetLink = () => {
        editor.chain().focus().unsetLink().run()
    }

    

    

    const handleImageUpload = useCallback((e) => {
        console.log(e.target.files[0])
        const file = e.target.files[0]
        
        if (file) {
            const imgUrl = URL.createObjectURL(file)
            
            editor.chain().focus().setImage({src: imgUrl}).run()
            imageRef.current.value = ''
        }
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className='tt-cont rounded'>
            <div className='tt-menu p-2 flex gap-2 flex-wrap'>
                <button onClick={handleBoldClick} className={editor && editor.isActive('bold') ? 'tt-active' : ''}>
                    <RiBold></RiBold>
                </button>
                <button>
                    <RiItalic></RiItalic>
                </button>
                <button className={editor.isActive('heading', {level: 1}) ? 'tt-active' : ''} onClick={() => handleHeadings(1)}>
                    <RiH1></RiH1>
                </button>
                <button onClick={() => handleHeadings(2)}>
                    <RiH2></RiH2>
                </button>
                <button onClick={() => handleHeadings(3)}>
                    <RiH3></RiH3>
                </button>
                <label htmlFor='file-upload'>
                    
                    <RiImageAddFill></RiImageAddFill>
                    
                </label>
                <input id='file-upload' type='file' accept='image/' className='hidden' onChange={handleImageUpload} ref={imageRef}>
                </input>
                <div className='relative'>
                <button className={displayLinkInput ? 'tt-active' : ''} onClick={() => setDisplayLinkInput(!displayLinkInput)}>
                    <RiLink></RiLink>
                    
                </button>
                
                        {displayLinkInput ?
                        <div className='tt-link-input'>
                            <label htmlFor='tt-url-inp'>ENTER URL:</label>
                            <input id='tt-url-inp' type='url' placeholder='www.example.com' ref={urlInputRef}></input>
                            <div className='flex gap-2 p-2 justify-end'>
                           
                            <button onClick={() => setDisplayLinkInput(false)}>Cancel</button>
                            <button onClick={setLink}>Enter</button>
                            </div>
                        </div>
                        : null}
                    
                </div>
                <button onClick={handleUnsetLink}>
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