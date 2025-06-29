const Post = require('../models/models'); 

const incrementLike = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: 1 } }, 
            { new: true }           
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: "Like added successfully", post });
    } catch (error) {
        console.error("Error incrementing like:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { incrementLike };
