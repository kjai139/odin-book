import UserBio from "../home/userBio";
import axiosInstance from '../../../../axios'

interface UserPostTabProps {
    bio: string,
    recentActivity: any
}


export default function UserPostTab ({bio, recentActivity}:UserPostTabProps) {




    return (
        <div className="flex flex-col up-content-cont">
            <div className="flex">
                {/* left */}
                <div className="flex flex-col flex-1">
                    <UserBio bio={bio} mode={'up'}></UserBio>

                </div>

                {/* right */}
                <div className="flex flex-col flex-1">
                    <div>
                        <h1>RANDOM CONTENT</h1>
                    </div>

                </div>

            </div>

        </div>
    )
}