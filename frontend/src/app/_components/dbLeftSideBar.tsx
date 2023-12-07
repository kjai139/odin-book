import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import { PenIcon, UserPortrait, VideoIcon } from './SVGRComponent'
import { formatUsername } from '../_utils/formatStrings'

import { FaUserFriends } from 'react-icons/fa'
import { TiUserAdd } from 'react-icons/ti'
import { usePathname } from 'next/navigation'
import { FaStreetView } from 'react-icons/fa'
import { useState } from 'react'

interface LeftSideBarProps {
    selectTab: React.Dispatch<React.SetStateAction<number>>
}

export default function DashboardLeftSideBar ({selectTab}:LeftSideBarProps) {

    const { user } = useAuth()
    const pathname = usePathname()

    const iconSize = 28
    const [selected, setSelected] = useState('')

    const HomeContent = [
        {
            image: user && user.image? <Image src={user.image} width={30} height={30} alt='user profile picture'></Image> :
            <UserPortrait width="30" height="30"></UserPortrait>,
            title: user && user.name && formatUsername(user.name),
            id: 'dashleft-0',
            display: 1,
            
        },
        {
            image: <PenIcon width="30" height="30"></PenIcon>,
            title: 'Posts',
            id: 'dashleft-1',
            display: 2,
        },
        {
            image:  <VideoIcon width="30" height="30"></VideoIcon>,
            title: 'Videos',
            id: 'dashelft-2',
            display: 3,
        }
    ]

    const FriendsContent = [
        {
            image: <div className='icon-cont'><FaUserFriends size={iconSize}></FaUserFriends></div>,
            title: 'Your friends',
            id:'friendsleft-1',
            display: 1
        },
        {
            image: <div className='icon-cont'><TiUserAdd size={iconSize}></TiUserAdd></div>,
            title: 'Friend requests',
            id: 'friendsleft-2',
            display: 2
        },
        {
            image: <div className='icon-cont'><FaStreetView size={iconSize}></FaStreetView></div>,
            title: 'Suggestions',
            id: 'friendsleft-3',
            display: 3
        }
    ]

    const getRenderedContent = () => {
        switch(pathname) {
            case '/dashboard':
                return HomeContent
            case '/dashboard/friends':
                return FriendsContent
            default:
                return []


        }
    }

    

    const handleSelect = (display:number, id:string) => {
        selectTab(display)
        setSelected(id)
    }
    
    


    return (
        <div className='relative'>
        <ul className='dashb-l-side fixed'>
            {user && getRenderedContent().map((node) => {
                return (
                    <li key={`sb-${node.id}`}>
                        <button className={`${selected === node.id ? 'l-side selected' : ''}`} onClick={() => handleSelect(node.display, node.id)}>
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