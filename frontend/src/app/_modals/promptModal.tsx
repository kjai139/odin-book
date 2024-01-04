



type PromptModalProps = {
    agreeFunc: () => void,
    closeModal: () => void,
    promptMsg: string,

}


export default function PromptModal({agreeFunc, closeModal, promptMsg}: PromptModalProps) {
    return (
        <div className="overlay-inner flex items-center justify-center">
            <div className="flex flex-col items-center justify-center rounded bg-white p-4 shadow border gap-4">
                <div>
                    <p className="text-xl">{promptMsg}</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-login-bg border-2 rounded py-1 px-2" type="button" onClick={agreeFunc}>Yes</button>
                    <button className="bg-login-bg border-2 rounded py-1 px-2" type="button" onClick={closeModal}>Nope</button>
                </div>
            </div>

        </div>
    )
}