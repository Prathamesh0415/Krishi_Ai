import {Schema, model, models } from 'mongoose'

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    createdAt: {
        type:Date,
        default: Date.now()
    }
})

const User = models.User || model<IUser>("user", userSchema)
export default User
