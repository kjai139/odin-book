


export interface Post {
    _id:string,
    body: string | object,
    createdAt: Date,
    likes: Number,
    dislikes: Number,
    title: string | null,
    comments: string[],
    author: string,

}