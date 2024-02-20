
import { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'

type NavObjects = {
    icon:any,
    tooltip: string,
    id: string,
    url: string,
    route: number
}

interface DashboardMobileNavProps {
    navRoutes: NavObjects[]
}

export default function DashboardMobileNav ({navRoutes}:DashboardMobileNavProps) {

    const [isExpanded, setIsExpanded] = useState(false)

    const toggleMenu = () => {
        setIsExpanded(!isExpanded)
    }



    return (
        <div className='top-nav-burger'>
            <div className='flex h-full'>
                <button onClick={toggleMenu}>
                    <RxHamburgerMenu size={24}></RxHamburgerMenu>
                </button>

            </div>
            <ul className='burger-menu absolute p-2 flex flex-col gap-2'>
               {navRoutes && navRoutes.map((node) => {
                return (
                    <li key={node.id} className='px-4 py-2'>
                        <button className='flex items-center gap-2'>
                            <div>
                                {node.icon}
                            </div>
                            <span>
                                <p>
                                    {node.tooltip}
                                </p>
                            </span>
                        </button>

                    </li>
                )
               })}

            </ul>
        </div>
    )
}