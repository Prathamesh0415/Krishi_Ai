import mongoose, { model, models, Schema} from "mongoose"

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

export const Post = models.post || model<IPost>("post", postSchema)