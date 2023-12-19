

export default function Loading() {
    const sidebarLength = Array.from({ length: 3})
    const mainSkeleLength = Array.from({ length: 3})
    return (
       <>
        <div className='flex-1'>
            <div>
        <ul className='dashb-l-side'>
            {sidebarLength.map((_, index) => {
                return (
                    <li key={`loader-${index}`}>
                        
                        <div className="skeleton-loader"></div>
                    </li>
                )
            })}
           
        </ul>
        </div>
        </div>
        <div className="flex-1 center-tab">
        <div className="flex flex-col gap-4 mt-8"> 
            {mainSkeleLength.map((_, index) => {
                return (
                    <div key={`mskele-${index}`} className="skeleton-loader para"></div>
                )
            })}
                
        
                    
              
        </div>
        </div>
        <div className="flex-1">
        </div>
        </>


        
    )
}