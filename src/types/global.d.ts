import { Document } from "mongoose"

declare global {
    export interface IUser extends Document {
        _id: string,
        name: string
        email: string
        image: string
        password: string
        createdAt: Date
    }

    export interface IPost extends Document {
        _id: string,
        userId: string,
        category: enum,
        title: string,
        description: string,
        createdAt: Date
    } 
}