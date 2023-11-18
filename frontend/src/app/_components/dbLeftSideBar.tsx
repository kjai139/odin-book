import Image from 'next/image'
import { useAuth } from '../../../context/authContext'
import { PenIcon, UserPortrait, VideoIcon } from './SVGRComponent'

export default function DashboardLeftSideBar () {

    const { user } = useAuth()

    type FullName = string

    const formatUsername = (name: FullName) => {
        const splitname = name.split(' ')
        const firstname =  splitname[0].charAt(0).toUpperCase() + splitname[0].slice(1)
        const lastname = splitname[1].charAt(0).toUpperCase() + splitname[1].slice(1)
        return firstname + ' ' + lastname
    }
    
    


    return (
        <ul className='dashb-l-side'>
            <li>
                <button>
                    <div className='flex gap-2 items-center align-center'>
                        { user && user.image ?
                        <Image src={user.image} width={30} height={30} alt='user profile picture'></Image> :
                        <UserPortrait width="30" height="30"></UserPortrait>
                        }
                        <span>
                            {user && user.name &&
                            <p>{formatUsername(user.name)}</p>
                            }
                        </span>
                    </div>
                </button>
            </li>
            <li>
                <button>
                    <div className='flex gap-2 items-center align-center'>
                        <PenIcon width="30" height="30"></PenIcon>
                        <span>
                            Posts
                        </span>
                    </div>
                    
                </button>
            </li>
            <li>
                <button>
                    <div className='flex gap-2 items-center align-center'>
                        <VideoIcon width="30" height="30"></VideoIcon>
                        <span>
                            Videos
                        </span>
                    </div>
                   
                </button>
            </li>
        </ul>
    )
}