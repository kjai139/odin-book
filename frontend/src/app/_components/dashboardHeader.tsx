'use client'



import { FriendsIcon, HomeIcon, UserPortrait, GroupIcon } from './SVGRComponent'
import { useAuth } from '../../../context/authContext'
import { Tooltip } from 'react-tooltip'
import { useRef, useState } from 'react'

import AccountDModal from '../_modals/accountDetailModal'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

interface DashboardProps {
  
}

export default function DashboardHeader() {

    const pathname = usePathname()
    const router = useRouter()

    const { user } = useAuth()

    const [showingModal, setShowingModal] = useState('')
    const iconSize = 34
    
    const topNav = [
        {
            icon: <HomeIcon></HomeIcon>,
            tooltip: 'Home',
            id: 'head-0',
            url: '/dashboard',
            route: 0
        }, 
        {
            icon: <FriendsIcon></FriendsIcon>,
            tooltip: 'Friends',
            id: 'head-1',
            url: '/dashboard/friends',
            route: 1
        },
        {
            icon: <GroupIcon></GroupIcon>,
            tooltip: 'Groups',
            id: 'head-2',
            url: '/dashboard/groups',
            route: 2
        }
    ]

    
    
    


    return (
        <div className="fixed hh w-screen flex px-2 dash-head shadow">
                <div>

                </div>
                
                <ul className="flex gap-8 items-center">
                {
                    topNav.map((node) => {
                        return (
                            <li key={node.id} className={`header-li ${pathname === node.url ? 'selected' : ''}`}>
                                <button className={`head-btn btn-${node.id}`} onClick={() => router.push(node.url)}>
                                {node.icon}
                                </button>
                                
                                <Tooltip content={node.tooltip} anchorSelect={`.btn-${node.id}`}></Tooltip>

                            </li>
                        )
                    })
                }
                </ul>

                
                <ul className="flex gap-4 items-center">
                    <li className='relative'>
                        <button onClick={() => setShowingModal('Account')} type="button" className="head-btn" id='head-acc-btn'>
                            {
                                user && user.image ? 
                                <div className='relative header-pfp rounded-full overflow-hidden'>
                                <Image src={user.image} fill={true} alt='user profile picture' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image>
                                </div> :
                                <UserPortrait height={iconSize} width={iconSize}></UserPortrait>
                            }
    
                        </button>
                        {showingModal === 'Account' ? null :
                        <Tooltip content='Account' anchorSelect='#head-acc-btn'></Tooltip> 
                        }
                        
                        <AccountDModal isShowing={showingModal === 'Account' ? true : false } closeModal={() => setShowingModal('') }></AccountDModal>
                    </li>
                    
                   

                </ul>

            </div>
    )
}