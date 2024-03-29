import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import { BiSolidRightArrow } from 'react-icons/bi'
import Placeholder from '@tiptap/extension-placeholder'
import axiosInstance from '../../../axios'
import { Post } from "../../../interfaces/post.interface"
import Image from "next/image"
import { useAuth } from "../../../context/authContext"
import { BsPersonCircle } from 'react-icons/bs'
import { useEffect, useState } from "react"
import { Comment } from "../../../interfaces/comment.interface"
import CommentRenderer from "../_components/commentRenderer"
import CharacterCount from "@tiptap/extension-character-count"
import ResultModal from "./resultModal"

interface CommentModalProps {
    thePost: Post,
    isShowing: boolean
}

export default function CommentModal ({thePost,isShowing}:CommentModalProps) {

    const [postCmts, setPostCmts] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [totalPages, setTotalPages] = useState<number>()
    const [curPage, setCurPage] = useState<number>(1)
    const [totalComments, setTotalComments] = useState(0)
    const [userComments, setUserComments] = useState<Comment[]>([])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write a comment...'
            }),
            CharacterCount.configure({
                limit:300,
                mode: 'nodeSize'
            })
        ],
        editorProps: {
            attributes: {
                class: 'cmt-editor p-2'
            }
        }
    })

    const { user } = useAuth()

    const postComment = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post('/api/comment/post', {
                content: editor?.getJSON(),
                postId: thePost._id,
                pageNum: curPage,
                skip: userComments.length
            }, {
                withCredentials: true
            })

            if (response.data.updatedComments) {
                setIsLoading(false)
                console.log('updated post w comment:', response.data.updatedComments)
                /* setPostCmts(response.data.updatedComments) */
                setUserComments(prev => [response.data.newUserComment, ...prev])
                setTotalPages(response.data.totalPages)
                setTotalComments(response.data.totalComments)
                editor?.commands.clearContent()
            }

        } catch (err) {
            setIsLoading(false)
            console.error(err)
            if (typeof err === 'string') {
                setErrorMsg(err)
            } else {
                setErrorMsg('An error has occured.')
            }
        }
    }

    const loadPostComments = async () => {
        try {
            const response = await axiosInstance.get(`/api/comments/get/?postId=${thePost._id}&pageNum=1`, {
                withCredentials: true
            })

            if (response.data.comments) {
                console.log(response.data.comments)
                console.log('total pages of comments:', response.data.totalPages)
                setPostCmts(response.data.comments)
                setTotalComments(response.data.totalComments)
                setTotalPages(response.data.totalPages)

            }
        } catch (err) {
            console.error(err)
        }
    }

    const viewMoreComments = async () => {
        try {
            console.log(`Getting comments page ${curPage + 1}`)
            
            const response = await axiosInstance.get(`/api/comments/get/?postId=${thePost._id}&pageNum=${curPage + 1}&skip=${userComments.length}`, {
                withCredentials: true
            })

            if (response.data.comments) {
                setCurPage(prevPage => prevPage + 1)
                console.log(`PAGE ${response.data.curPage}`, response.data.comments)
                console.log('new total pages of comments:', response.data.totalPages)
                setPostCmts(prev => [...prev, ...response.data.comments])
                setTotalPages(response.data.totalPages)

            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (isShowing && thePost) {
            console.log(thePost, 'thePost from cmt modal')
            loadPostComments()
        } else if (!isShowing && thePost) {
            setUserComments([])
            setCurPage(1)
            setPostCmts([])
        }
    }, [isShowing, thePost])


    return (
        <>
        <div className={`flex cmt-modal-pfp flex-col ${isShowing && 'show'}`}>
        <div className="flex">   
        {user && user.image ? 
        
                <div> 
                <div className='relative cmt-pfp-cont rounded-full overflow-hidden ml-1 mr-2 flex-shrink-0'>
                <Image src={user.image} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='user pic'></Image>
                </div>
                </div>
                :
                <BsPersonCircle className="backup-user-img" size={26}></BsPersonCircle> 
        
        }
        
        <div className={`cmt-modal-cont relative rounded mr-2 mb-2 w-full min-w-0 ${isShowing && 'show'}`}>
            {/* set min-width to 0 to prevent overflow.  */}
            {isLoading && <div className="overlay-cmt"></div>}
            {errorMsg && 
                <ResultModal resultMsg={errorMsg} closeModal={() => setErrorMsg('')}></ResultModal>
            }
            <EditorContent editor={editor}></EditorContent>
            <div className="flex justify-end">
                <button className="p-2" type="button" onClick={postComment}>
                <BiSolidRightArrow style={{
                    color: 'gray',
                }}></BiSolidRightArrow>
                </button>
            </div>

        </div>
        </div>
        {totalComments !== undefined && (
            <span className="p-2">
                {totalComments === 0 ? 'No Comments' : `${totalComments} ${totalComments === 1 ? 'Comment' : 'Comments'}`}
            </span>
            )}
        {/* the user comments just posted */}
        { isShowing && userComments && userComments.map((node) => {
            return (
                <div key={node._id} className="post-cmts">
                    <CommentRenderer comment={node}></CommentRenderer>
                    
                </div>
            )
        }) 
        
        }
        {/* post comments */}
        {isShowing && postCmts && postCmts.map ((node:any) => {

            return (
                <div key={node._id} className="post-cmts">
                    <CommentRenderer comment={node}></CommentRenderer>
                    
                </div>
            )
        })}
        {isShowing && postCmts && totalPages && totalPages > curPage ?
        <div className="flex justify-center p-2">
            <button type="button" onClick={viewMoreComments}>View more</button>
        </div> : null
            
        }

        
        </div>
        </>
    )
}