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
        ref: "User",
        required: true
    }
}, {timestamps: true})

export const Post = models.Post || model<IPost>("Post", postSchema)