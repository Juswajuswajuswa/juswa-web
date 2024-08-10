import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String, 
            required: true, 
        },
        previewTitle: {
            type: String, 
            default: "Secret",
            required: true
        },
        previewContent: {
            type: String, 
            default: "Secret",
            required: true
        }, 
        
        
        
        comments: [{
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        }],

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {timestamps: true}
)

const Post = mongoose.model('Post', PostSchema)

export default Post