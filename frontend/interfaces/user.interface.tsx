import { Post } from './post.interface'


export interface User {
    _id: string,
    name: string,
    email: string,
    phoneNumber: string | undefined | null,
    image: string | undefined | null,
    gender: string,
    friendlist: string[],
    friendReq: Array<string | User>,
    posts: Post[],
    status: string,
    uniqueId: string,
    bio: string | null
}