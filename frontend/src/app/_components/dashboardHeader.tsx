



import { FriendsIcon, HomeIcon, UserPortrait, GroupIcon } from './SVGRComponent'
import { useAuth } from '../../../context/authContext'


interface DashboardProps {
  
}

export default function DashboardHeader() {


    const { user, isAuthenticated, signOut } = useAuth()



    return (
        <div className="fixed hh w-screen flex px-2">
                <div>

                </div>
                
                <ul className="flex gap-4 items-center">
                    <li>
                        <button type="button" className="head-btn">
                            <HomeIcon></HomeIcon>
                        </button>

                    </li>
                    <li>
                        <button type="button" className="head-btn">
                            <FriendsIcon></FriendsIcon>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="head-btn">
                            <GroupIcon></GroupIcon>
                        </button>
                    </li>
                </ul>

                
                <ul className="flex gap-4 items-center">
                    <li>
                        <button type="button" className="head-btn">
                            <UserPortrait height="34" width="34"></UserPortrait>
                        </button>
                    </li>
                    <li>
                        <button type="button" onClick={signOut}>Sign out</button>
                    </li>

                </ul>

            </div>
    )
}