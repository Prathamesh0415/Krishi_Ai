import mongoose, { models, model, Schema} from "mongoose"

const commentSchema = new Schema({
    postId: { 
        type: Schema.Types.ObjectId, 
        ref: "post", 
        index: true 
    },
    authorId: { 
        type: Schema.Types.ObjectId, 
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: "comment",
        default: null
  }
}, { timestamps: true })

export const Comment = models.comment || model("comment", commentSchema)