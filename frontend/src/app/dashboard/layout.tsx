
import DashboardHeader from "../_components/dashboardHeader"




export default function DashboardLayout({children}: {children: React.ReactNode}) {



    return (
        <div className="h-screen w-screen flex flex-col">
            <DashboardHeader></DashboardHeader>
            <div className="bc relative">
                <div className="db-g-cont">
                    {children}
                </div>
            </div>
            
        </div>
    )
}