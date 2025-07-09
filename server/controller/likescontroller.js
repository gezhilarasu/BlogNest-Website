const {Post} = require('../models/models');


const toggleLikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likedBy.includes(userId);
    if (isLiked) {
      post.likedBy.pull(userId);
      post.likes = Math.max(post.likes - 1, 0);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    return res.status(200).json({ message: isLiked ? "Unliked" : "Liked", likes: post.likes });
  } catch (err) {
    console.error("Error toggling like:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { toggleLikePost };
