import { useEffect, useRef } from "react"
import { useAuth } from "../../../context/authContext"


interface AccountDModalProps {
    isShowing: boolean,
    closeModal: () => void
}

export default function AccountDModal({isShowing, closeModal}:AccountDModalProps) {

    const { signOut } = useAuth()
    const modalRef = useRef<any>(null)

    const handleClickOutside = (event:MouseEvent) => {
        if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
            closeModal()
        }
    }

    useEffect(() => {
        if (isShowing) {
            document.addEventListener('mousedown', handleClickOutside)
            console.log('modal listener added')
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            console.log('modal listener cleaned up')
        }
    }, [isShowing])



    return isShowing && (
       
        <ul ref={modalRef} className="header-modal border shadow">
            <li>
                <button className="hm-btn" onClick={signOut}>Sign out</button>
            </li>
        </ul>
       
        
    )
}