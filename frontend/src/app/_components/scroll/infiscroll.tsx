import { useEffect, useRef } from "react"

interface InfiSCrollProps{
    loadMore: () => void | Promise<void>;
}

export default function InfiScroll ({loadMore}:InfiSCrollProps) {

    const sentinelRef = useRef<any>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMore()
                }
            })
        })

        observer.observe(sentinelRef.current)

        return () => observer.disconnect()
    }, [loadMore])



    return (
        <div ref={sentinelRef}>

        </div>
    )
}