
interface ExpandBtnProps  {
    refEle : any,
    isExpanded: boolean,
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}


export default function ExpandBtnTT ({refEle, isExpanded, setIsExpanded}:ExpandBtnProps) {

    const checkHeight = () => {
        console.log(refEle.current.clientHeight)
        console.log(refEle.current.children[0].children[0].scrollHeight)
        console.log(refEle.current.children[0].scrollHeight)
    }

    const toggleView = () => {
        setIsExpanded(!isExpanded)
        checkHeight()
    }


    return (
        <>
            <button onClick={toggleView}>{isExpanded ? '...View less' : '...View more'}</button>
        </>
    )
}