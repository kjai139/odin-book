import { User } from "./user.interface"



export interface Comment {
    author: User,
    body: String,
    createdAt: Date,
    likes: Number, 
    dislikes: Number
}
