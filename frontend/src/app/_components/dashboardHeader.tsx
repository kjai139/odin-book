



import { FriendsIcon, HomeIcon, UserPortrait, GroupIcon } from './SVGRComponent'
import { useAuth } from '../../../context/authContext'
import { Tooltip } from 'react-tooltip'
import { useRef, useState } from 'react'

import AccountDModal from '../_modals/accountDetailModal'

interface DashboardProps {
  
}

export default function DashboardHeader() {

    const modalRef = useRef(null)

    const [showingModal, setShowingModal] = useState('')
    
    const topNav = [
        {
            icon: <HomeIcon></HomeIcon>,
            tooltip: 'Home',
            id: 'head-1'
        }, 
        {
            icon: <FriendsIcon></FriendsIcon>,
            tooltip: 'Friends',
            id: 'head-2'
        },
        {
            icon: <GroupIcon></GroupIcon>,
            tooltip: 'Groups',
            id: 'head-3'
        }
    ]

    
    
    


    return (
        <div className="fixed hh w-screen flex px-2 dash-head shadow">
                <div>

                </div>
                
                <ul className="flex gap-4 items-center">
                {
                    topNav.map((node) => {
                        return (
                            <li key={node.id}>
                                <button className={`head-btn btn-${node.id}`}>
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
                            <UserPortrait height="34" width="34"></UserPortrait>
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