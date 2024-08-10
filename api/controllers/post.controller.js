import Post from "../models/post.model.js";
import User from "../models/User.model.js";
import { handleMakeError } from "../utils/handleMakeError.js";

export const addPost = async (req, res, next) => {
  const tokenUserId = req.user.id; // Get user ID from token
  console.log(tokenUserId);

  const { title, content, previewTitle, previewContent } = req.body;

  if (title.toLowerCase() !== previewTitle.toLowerCase())
    return next(
      handleMakeError(404, "Preview Title and Title should be equal")
    );
  
  if (
    title === "" ||
    content == "" ||
    previewTitle === "" ||
    previewContent === ""
  )
    return next(handleMakeError(404, "Please input required fields"));

  try {

    // if post title already exist, throw an error you cant post the same post with the same title
    const existingPost = await Post.findOne({
      title: {$regex: new RegExp(`^${title}$`, 'i')}, // i used regular expression with the "i" to make it case-insensitive
      userId: tokenUserId
    });
    if (existingPost) {
      return next(handleMakeError(400, "You already have a post with this title my guy"));
    }
  
    // Create a new post
    const newPost = new Post({
      title,
      content,
      previewTitle,
      previewContent,
      userId: tokenUserId, // Associate post with the user
    });



    // Save the new post
    await newPost.save();

    // Update the user to include the new post ID
    await User.findByIdAndUpdate(tokenUserId, {
      $push: { postId: newPost._id }, // Push the new post ID to the postId array
    });

    // alternative pushing the newpost to the postId in the user model
    // const user = await User.findById(tokenUserId)
    // user.postId.push(newPost)
    // await user.save()

    res.status(201).json(newPost); // Return the created post
  } catch (error) {
    next(error); // Handle errors
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const allPost = await Post.find().populate({
      path: "userId",
      select: "username email profilePhoto",
      
    }).populate({
      path: "comments",
      select: "userId content",
      populate: {
        path: "userId",
        select: "username"
      }
    }).sort({createdAt: -1}) // adding this sort so if added new post, post will automatically go on top
    res.status(200).json(allPost);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const getPost = await Post.findById(id).populate({
      path: "userId",
      select: "username email profilePhoto",
    });
    if (!getPost) return next(handleMakeError(400, "Post not found!"));
    return res.status(200).json(getPost);
  } catch (error) {
    next(error);
  }
};

export const deletePosts = async (req, res, next) => {
  try {
    // Find all posts
    const allPosts = await Post.find();

    // Extract all post IDs
    const postIds = allPosts.map((post) => post._id);

    // Update users to remove references to the posts
    await User.updateMany(
      { postId: { $in: postIds } },
      { $pull: { postId: { $in: postIds } } }
    );

    // Delete all posts
    await Post.deleteMany({ _id: { $in: postIds } });

    res.status(200).json({ message: "All posts deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting posts" });
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const tokenUserId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (post.userId.toString() !== tokenUserId) {
      return res.status(400).json({ message: "You are not authorized to delete this post!" });
    }

    const user = await User.findById(post.userId);

    if (user) {
      // remove the id from the user's postId array
      user.postId.pull(postId);
      // save the updated user document
      await user.save();
    }

    // deleting the postId if user === post.userId
    await Post.findByIdAndDelete(postId);

    res.status(200).json("successfully deleted");
  } catch (error) {
    next(error);
  }
};



export const editPost = async (req, res, next) => {
  const { id } = req.params;
  const tokenUserId = req.user.id;
  console.log(tokenUserId)
  const { title, content, previewTitle, previewContent } = req.body;

  if (title !== previewTitle)
    return next(
      handleMakeError(404, "Preview Title and Title should be equal")
    );

  if (
    title === "" ||
    content == "" ||
    previewTitle === "" ||
    previewContent === ""
  )
    return next(handleMakeError(404, "Please input required fields"));


  try {
    // Find the post by ID and populate the userId field
    const post = await Post.findById(id).populate({
      path: "userId"
    });

    if (!post) {
      return next(handleMakeError(404, 'Post not found'));
    }

    console.log(post); 

    // Convert both tokenUserId and post.userId._id to strings for comparison
    // if (String(tokenUserId) !== String(post.userId._id)) {
    //   return next(handleMakeError(403, 'Unauthorized'));
    // }

    if (tokenUserId !== post.userId._id.toString()) {
      return next(handleMakeError(403, 'Unauthorized'));
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, previewTitle, previewContent },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
    console.log(error)
  }
}

export const getUserPosts = async (req, res, next) => {
  const {userId} = req.params

  try {
    // if (searchTerm) {
    //   filter.$or = [
    //     { title: { $regex: searchTerm, $options: 'i' } },
    //     { content: { $regex: searchTerm, $options: 'i' } }
    //   ];
    // }

    const posts = await Post.find({userId})
    if (!posts) return next(handleMakeError(404, "Post not found"))
      res.status(200).json(posts)
  } catch (error) {
    next(error)
    console.log(error)
  }
}