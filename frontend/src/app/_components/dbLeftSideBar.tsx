import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import { PenIcon, UserPortrait, VideoIcon } from './SVGRComponent'
import { formatUsername } from '../_utils/formatStrings'

import { FaUserFriends } from 'react-icons/fa'
import { TiUserAdd } from 'react-icons/ti'
import { usePathname } from 'next/navigation'
import { FaStreetView } from 'react-icons/fa'
import { useEffect, useState } from 'react'

interface LeftSideBarProps {
    selectTab: React.Dispatch<React.SetStateAction<number>>
}

export default function DashboardLeftSideBar ({selectTab}:LeftSideBarProps) {

    const { user } = useAuth()
    const pathname = usePathname()

    const iconSize = 24
    const [selected, setSelected] = useState('')

    const HomeContent = [
        {
            image: user && user.image? <Image src={user.image} fill={true} alt='user profile picture' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={true}></Image> :
            <UserPortrait width={iconSize} height={iconSize}></UserPortrait>,
            title: user && user.name && formatUsername(user.name),
            id: 'dashleft-0',
            display: 1,
            counter: null
            
        },
        {
            image: <PenIcon width={iconSize} height={iconSize}></PenIcon>,
            title: 'Posts',
            id: 'dashleft-1',
            display: 2,
            counter:null
        },
        {
            image:  <VideoIcon width={iconSize} height={iconSize}></VideoIcon>,
            title: 'Videos',
            id: 'dashelft-2',
            display: 3,
            counter:null
        }
    ]

    const FriendsContent = [
        {
            image: <div className='icon-cont'><FaUserFriends size={iconSize}></FaUserFriends></div>,
            title: 'Your friends',
            id:'friendsleft-1',
            display: 1,
            counter: null
        },
        {
            image: <div className='icon-cont'><TiUserAdd size={iconSize}></TiUserAdd></div>,
            title: 'Friend requests',
            id: 'friendsleft-2',
            display: 2,
            counter: user && user.friendReq.length
        },
        {
            image: <div className='icon-cont'><FaStreetView size={iconSize}></FaStreetView></div>,
            title: 'Suggestions',
            id: 'friendsleft-3',
            display: 3,
            counter: null
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
        <div className='flex-1'>
            <div>
        <ul className='dashb-l-side'>
            {user && getRenderedContent().map((node) => {
                return (
                    <li key={`sb-${node.id}`}>
                        <button className={`relative ${selected === node.id ? 'l-side selected' : ''}`} onClick={() => handleSelect(node.display, node.id)}>
                        {node.counter !== null && 
                                <div className='frdReq'>
                                    {node.counter}
                                </div>
                                    }
                        
                            <div className='flex gap-2 items-center align-center whitespace-nowrap relative'>
                                
                                <div className='relative sb-img-cont items-center justify-center flex rounded-full overflow-hidden'>
                                
                                {node.image}
                                </div>
                                
                                <span>{node.title}</span>
                            </div>
                        </button>
                    </li>
                )
            })}
           
        </ul>
        </div>
        </div>
    )
}