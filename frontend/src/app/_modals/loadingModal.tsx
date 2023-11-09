import { ProgressBar } from "react-loader-spinner";



// type LoadingModalProps = {
//     closeModal: void
    
// }


export default function LoadingModal() {


    return (
        <div className="overlay-inner">
            <ProgressBar
            width={80}
            height={80}
            ariaLabel="progress-bar-loading"
            borderColor="green"
            barColor="green"
            ></ProgressBar>
        </div>
    )

}