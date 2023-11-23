import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import { PenIcon, UserPortrait, VideoIcon } from './SVGRComponent'

interface LeftSideBarProps {
    selectTab: React.Dispatch<React.SetStateAction<number>>
}

export default function DashboardLeftSideBar ({selectTab}:LeftSideBarProps) {

    const { user } = useAuth()

    type FullName = string

    

    const formatUsername = (name: FullName) => {
        const splitname = name.split(' ')
        const firstname =  splitname[0].charAt(0).toUpperCase() + splitname[0].slice(1)
        const lastname = splitname[1].charAt(0).toUpperCase() + splitname[1].slice(1)
        return firstname + ' ' + lastname
    }

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
        <ul className='dashb-l-side'>
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
    )
}