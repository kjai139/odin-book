import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from 'react-player/file'


interface VideoUploaderProps {
    setVideoData: Dispatch<SetStateAction<File[] | null>>,
    size: 'normal' | 'small'
}


export default function VideoUploader ({setVideoData, size}:VideoUploaderProps) {

    const [previewVideo, setPreviewVideo] = useState('')
    const [previewVolume, setPreviewVolume] = useState()
    const onDrop = useCallback((acceptedFiles:File[]) => {
        /* console.log(acceptedFiles) */
        const previewURL = URL.createObjectURL(acceptedFiles[0])
        setPreviewVideo(previewURL)
        setVideoData(acceptedFiles)
        
    }, [setVideoData])

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({onDrop, accept: {
        'video/mp4': ['.mp4'],
        'video/webm': ['.webm'],
        'image/gif': ['.gif']
    }, multiple: false})

    const formatBytes = (bytes:number, decimals = 2) => {
        if (bytes === 0) {
            return '0 Bytes'
        }
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }


    useEffect(() => {
        return () => {
            if (previewVideo) {
                URL.revokeObjectURL(previewVideo)
                console.log('objectURL cleaned')
            }
        }
    }, [previewVideo])


    return (
        <section className="p-4">
        <div {...getRootProps({ className: `dropzone ${size === 'small' && 'small'}`})}>
            <input {...getInputProps()}>
            </input>
            {
                isDragActive ?
                <p>Drop the file here...</p> :
                <p>Drag & drop or click to select a file</p>
            }

        </div>
        <ol className="accepted-files">
        { acceptedFiles.map((file, idx) => {
            return (
                <li key={`${file}-${idx}`} className="p-2">
                    <p>{file.name} - {formatBytes(file.size)}</p>
                </li>
            )
        })}
        </ol>
        {previewVideo &&
        <ReactPlayer url={previewVideo} controls={true} width="100%" height="auto"></ReactPlayer>
        }
        {/* <div className="flex gap-4 justify-end">
            <button>Clear</button>
            <button>Submit</button>
        </div> */}
        </section>
    )
}