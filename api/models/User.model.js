import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },  
    profilePhoto: {
      type: String,
      default:
        "https://medschool.uci.edu/sites/default/files/styles/staff_faculty_photo/public/media-images/noun-person-4046839-cropped-uci-site-colors_0.jpg?h=167045e9&itok=5PT_EoCP",
    },



    postId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    }]

    },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
