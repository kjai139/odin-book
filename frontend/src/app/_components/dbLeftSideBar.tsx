import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import { PenIcon, UserPortrait, VideoIcon } from './SVGRComponent'
import { formatUsername } from '../_utils/formatStrings'

interface LeftSideBarProps {
    selectTab: React.Dispatch<React.SetStateAction<number>>
}

export default function DashboardLeftSideBar ({selectTab}:LeftSideBarProps) {

    const { user } = useAuth()

    

    const sidebarContent = [
        {
            image: user && user.image? <Image src={user.image} width={30} height={30} alt='user profile picture'></Image> :
            <UserPortrait width="30" height="30"></UserPortrait>,
            title: user && user.name && formatUsername(user.name),
            id: '1'
        },
        {
            image: <PenIcon width="30" height="30"></PenIcon>,
            title: 'Posts',
            id: '2'
        },
        {
            image:  <VideoIcon width="30" height="30"></VideoIcon>,
            title: 'Videos',
            id: '3'
        }
    ]
    
    


    return (
        <div className='relative'>
        <ul className='dashb-l-side fixed'>
            {user && sidebarContent.map((node) => {
                return (
                    <li key={`sb-${node.id}`}>
                        <button onClick={() => selectTab(Number(node.id))}>
                            <div className='flex gap-2 items-center align-center'>
                                {node.image}
                                <span>{node.title}</span>
                            </div>
                        </button>
                    </li>
                )
            })}
           
        </ul>
        </div>
    )
}