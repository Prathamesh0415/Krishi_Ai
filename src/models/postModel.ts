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
    image:{
        type: String
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {timestamps: true})

export const Post = models.post || model<IPost>("post", postSchema)