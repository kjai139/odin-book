
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
import { useAuth } from '../../../../../context/authContext'

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
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(false)
    const pathname = usePathname()
    const { setSelectedTab, selectedTab } = useAuth()

    const toggleMenu = () => {
        setIsExpanded(!isExpanded)
    }



    const changeRoute = (url:string) => {
        setSelectedTab(0)
        router.push(url)
    }



    return (
        <div className='top-nav-burger'>
            <div className='flex h-full'>
                <button onClick={toggleMenu}>
                    <RxHamburgerMenu size={24}></RxHamburgerMenu>
                </button>

            </div>
            <ul className={`burger-menu absolute p-2 flex flex-col gap-2 ${isExpanded ? undefined : 'hidden'}`}>
               {navRoutes && navRoutes.map((node) => {
                return (
                    <li key={node.id} className={`px-4 py-2 burger-btn ${pathname === node.url ? 'selected' : undefined}`}>
                        <button className={`flex items-center gap-2`} onClick={() => changeRoute(node.url)}>
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
               {/* {pathname === '/dashboard' &&
               <>
               <li className={`px-4 py-2 ${selectedTab === 2 && 'bm-selected'}`}>
                <button onClick={() => setSelectedTab(2)}>
                <p>View all of your posts</p>
                </button>
                   
               </li>
               <li className={`px-4 py-2 ${selectedTab === 3 && 'bm-selected'}`}>
               <button onClick={() => setSelectedTab(3)}>
                <p>View your video posts</p>
                </button>
               </li>
               </>
               } */}
               
               

            </ul>
        </div>
    )
}