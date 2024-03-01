import { MdDelete } from 'react-icons/md'


interface PostModalProps {
    isExpanded: boolean
}


export default function PostModal ({isExpanded}:PostModalProps) {


    return (
        <div className={`absolute right-0 bot-0 shadow ${!isExpanded ? 'hidden' : undefined}`}>
            <div>
                <button>
                    <div className='flex items-center po-modal p-2 rounded'>
                        <MdDelete size={20}></MdDelete>
                        <p className='whitespace-no-wrap'>Delete post</p>

                    </div>
                </button>
            </div>

        </div>
    )
}