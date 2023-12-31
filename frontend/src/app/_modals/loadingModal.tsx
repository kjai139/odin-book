import { ProgressBar } from "react-loader-spinner";



export default function LoadingModal() {


    return (
        <div className="overlay-inner flex items-center justify-center">
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