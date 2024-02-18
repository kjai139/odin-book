
import { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'

export default function DashboardMobileNav () {

    const [isExpanded, setIsExpanded] = useState(false)



    return (
        <ul className='top-nav-burger'>
            <li className='flex h-full'>
                <button>
                    <RxHamburgerMenu size={24}></RxHamburgerMenu>
                </button>

            </li>
        </ul>
    )
}