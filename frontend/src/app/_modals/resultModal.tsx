

type ResultModalProps = {
    resultMsg: string,
    closeModal: () => void
}


export default function ResultModal({resultMsg, closeModal}: ResultModalProps) {
    return (
        <div className="overlay-inner flex items-center justify-center">
            <div className="flex flex-col items-center justify-center rounded bg-white p-4 shadow border gap-4">
                <div>
                    <p className="text-xl">{resultMsg}</p>
                </div>
                <div>
                    <button className="bg-login-bg border-2 rounded py-1 px-2" type="button" onClick={closeModal}>Close</button>
                </div>
            </div>

        </div>
    )
}