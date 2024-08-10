import Comment from "../models/comments.model.js";
import Post from "../models/post.model.js";
import { handleMakeError } from "../utils/handleMakeError.js";

export const createComment = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const tokenUserId = req.user.id;

  // validations
  if (!postId) return next(handleMakeError(400, "Post ID is required"));

  if (!content || content.trim() === "")
    next(handleMakeError(400, "You cannot comment an empty string"));

  // adding content including who posted it and which post it is
  try {
    const addComment = new Comment({
      content,
      postId,
      userId: tokenUserId,
    });

    // after adding the comments, save it in mongodb
    const savedComment = await addComment.save();

    // after saving the await addComment.save() to savedComment variable
    // make another variable populatedComment, saving the savedComment with populated: userId and username
    const populatedComment = await savedComment.populate({
      path: "userId",
      select: "userId, username",
    });

    // const populatedComment = await Comment.findById(savedComment._id).populate({
    //   path: "userId",
    //   select: "username"
    // });

    // after saving it, find the post which has the postId and push the comments in the postSchmea
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: populatedComment },
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  const tokenUserId = req.user.id;

  try {
    // find all the comments'ids, if commentId is in comment then it will show all the results
    const comment = await Comment.findById(commentId);
    // validating if comment dont exist then throw an error not found comment
    if (!comment) return next(handleMakeError(400, "comment not found"));

    // in this line, validating if comment.userId.toString() is not equal to tokenUserId then not authorized
    // if user did not post the comment in the postId then hes not authorized
    if (comment.userId.toString() !== tokenUserId)
      return next(
        handleMakeError(400, "You are not authorized to delete this comment")
      );

    // finding the comment._id and if commentId = is matched with comment._id then delete it
    await Comment.findByIdAndDelete(commentId);
    // pull the commentId from Post model comments array field also removing the referrence associated with the post
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// get comments
export const getComments = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).populate({
      path: "userId",
      select: "username",
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const deleteAllComment = async (req, res, next) => {
  try {
    const allComments = await Comment.find();
    // extracting all ids / ( all comments) coming from comments
    const commentId = allComments.map((comment) => comment._id);

    // find all the post's comments and update if commentId is matched with comments._id and update it
    await Post.updateMany(
      { comments: { $in: commentId } },
      // if matched then pull all the commentId that matched the Post.comments._id also this will make sure the ref comment in the post will also be removed or pulled
      { $pull: { comments: { $in: commentId } } }
    );
    // delete all the commentdId that matched the in Comment._id
    await Comment.deleteMany({ _id: { $in: commentId } });

    res.status(200).json({ message: "All comments has been deleted" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
