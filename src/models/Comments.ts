import mongoose, { models, model, Schema} from "mongoose"

const commentSchema = new Schema({
    postId: { 
        type: Schema.Types.ObjectId, 
        ref: "Post", 
        index: true 
    },
    authorId: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
  }
}, { timestamps: true })

export const Comment = models.comment || model("comment", commentSchema)