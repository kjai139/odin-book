import { Videos } from './video.interface'
import { User } from './user.interface'

export interface Post {
    _id:string,
    body: string | object,
    createdAt: Date,
    likes: Number,
    dislikes: Number,
    title: string | null,
    comments: string[],
    author: User,
    videos: Videos[],

}