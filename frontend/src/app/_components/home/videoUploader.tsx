import { useCallback } from "react";
import { useDropzone } from "react-dropzone";



export default function VideoUploader () {
    const onDrop = useCallback((acceptedFiles:File[]) => {
        console.log(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop, accept: {
        'video/mp4': ['.mp4'],
        'video/webm': ['.webm'],
        'image/gif': ['.gif']
    }})

    return (
        <div {...getRootProps({ className: 'dropzone'})}>
            <input {...getInputProps()}>
            </input>
            {
                isDragActive ?
                <p>Drop the files here...</p> :
                <p>Drag & drop or click to select files</p>
            }

        </div>
    )
}