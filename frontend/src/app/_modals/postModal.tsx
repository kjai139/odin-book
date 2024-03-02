import { MdDelete, MdReportGmailerrorred } from 'react-icons/md'


interface PostModalProps {
    isExpanded: boolean,
    postId: string,
    userId: string
}


export default function PostModal ({isExpanded, postId, userId}:PostModalProps) {


    return (
        <div className={`po-modal-cont absolute right-0 bot-0 shadow ${!isExpanded ? 'hidden' : undefined} rounded`}>
            <div>
               { postId === userId && 
               <div className='p-2'>
                <button className='po-modal'>
                    <div className='flex items-center p-2 rounded'>
            
                        <MdDelete size={20}></MdDelete>
                        <p className='pm-btn-txt'>Delete post</p>
                    
                    </div>
                </button>
                </div>
                }
                <div className='p-2'>
                <button className='po-modal'>
                <div className='flex items-center p-2 rounded'>
            
                    <MdReportGmailerrorred size={20}></MdReportGmailerrorred>
                    <p className='pm-btn-txt'>Report post</p>
                
                </div>
                </button>
                </div>

            </div>

        </div>
    )
}