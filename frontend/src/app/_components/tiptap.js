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
import axiosInstance from '../../../axios'
import { useAuth } from '../../../context/authContext'
import { useRouter } from 'next/navigation'


const TipTap = ({type}) => {
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
    const { user, setUser } = useAuth()

    const imageRef = useRef(null)
    const urlInputRef = useRef(null)

    const router = useRouter()

    const handleBoldClick = () => {
        editor.chain().focus().toggleBold().run()
    }

    const BLOCK_TYPE_OBJECTS = {
        'image': (block) => false
    }

    const checkIfcontentEmpty = (block) => {
        if (!block || !block.type) {
            return true
        }
        
        if (block.type in BLOCK_TYPE_OBJECTS) {
            return BLOCK_TYPE_OBJECTS[block.type](block)
        }

        if ('text' in block) {
            console.log('text found in content:', block.text, !block.text?.trim())
            return !block.text?.trim()
        }
        
        return block.content ? block.content.every((_block) => checkIfcontentEmpty(_block)) : true
    }

    const handleCreatePost = async () => {
        const json = editor.getJSON()
        console.log('post json:', json)
        console.log('is editor empty?:', editor.isEmpty)
        if (!editor.isEmpty) {
            if (!checkIfcontentEmpty(json)){
                console.log('Posting...')
                // if used for posts
                if (type === 'post') {
                    try {
                        const response = await axiosInstance.post('/api/post/create', {
                            content: json
                        }, {
                            withCredentials: true
                        })
        
                        console.log(response.data.message)
        
                        if (response.data.success) {
                            setUser(response.data.updatedUser)
                            editor.commands.clearContent()
                        }
        
                    } catch (err) {
                        console.log('Error creating post:', err)
                    }
                    // used for comments
                } else if (type === 'comment') {

                }
            } else {
                console.log('Editor is empty.')
            }
        } else {
            console.log('Editor empty.')
        } 
        
        
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

    const handleCodeToggle = () => {
        editor.chain().focus().toggleCode().run()
    }

    const handleQuoteToggle = () => {
        editor.chain().focus().toggleBlockquote().run()
    }

    const handleUnorderedList = () => {
        editor.chain().focus().toggleBulletList().run()
    }

    const handleOrderedList = () => {
        editor.chain().focus().toggleOrderedList().run()
    }

    

    

    const handleImageUpload = useCallback(async (e) => {
        console.log(e.target.files[0])
        const file = e.target.files[0]
        
        if (file) {
            /* const imgUrl = URL.createObjectURL(file) */
            const formData = new FormData()
            formData.append('image', file)
            try {
                const response = await axiosInstance.post('/api/image/temp/post', formData, {
                    withCredentials: true
                })

                if (response.data.success) {
                    console.log(response.data.message)
                    editor.chain().focus().setImage({src: response.data.url}).run()
                    imageRef.current.value = ''
                }
            } catch (err) {
                console.error(err)
                imageRef.current.value = ''
                if (err.response.status === 401) {
                    router.push('/')
                }
            }
            
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
                <button onClick={handleItalics} className={editor.isActive('italic') ? 'tt-active' : ''}>
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
                <button className={editor.isActive('code') ? 'tt-active' : ''} onClick={handleCodeToggle}>
                    <RiCodeBoxLine></RiCodeBoxLine>
                </button>
                <button onClick={handleQuoteToggle} className={editor.isActive('blockquote') ? 'tt-active' : ''}>
                    <RiDoubleQuotesL></RiDoubleQuotesL>
                </button>
                <button onClick={handleUnorderedList} className={editor.isActive('bulletList') ? 'tt-active' : ''}>
                    <RiListUnordered></RiListUnordered>
                </button>
                <button onClick={handleOrderedList} className={editor.isActive('orderedList') ? 'tt-active' : ''}>
                    <RiListOrdered></RiListOrdered>
                </button>

            </div>
            
            <EditorContent editor={editor} style={{
                borderTop: '2px solid var(--dashbgC)',
                borderBottom: '2px solid var(--dashbgC)',
                minHeight: '5rem',
                padding: '.75rem',

                
                
            }}></EditorContent>
            
            <div className='flex justify-end'>
                <div className='p-2'>
                    <button onClick={handleCreatePost}>Create post</button>
                </div>
            </div>
        </div>
    )
}


export default TipTap