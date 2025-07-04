const Comment = require('../models/models');

const createComment = async (req, res) => {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const { content, parentCommentId } = req.body;

    try {
        const comment = new Comment({
            userId,
            postId,
            content,
            parentCommentId: parentCommentId || null
        });
        await comment.save();
        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (err) {
        res.status(500).json({ message: "Error creating comment", error: err.message });
    }
};


const getCommentsByPost = async (req, res) => {
    const postId = req.params.postId;

    try {
        const comments = await Comment.find({ postId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        // Organize comments into nested format
        const commentMap = {};
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
        });

        const nestedComments = [];

        comments.forEach(comment => {
            if (comment.parentCommentId) {
                commentMap[comment.parentCommentId]?.replies.push(comment);
            } else {
                nestedComments.push(comment);
            }
        });

        res.status(200).json({ message: "Comments retrieved", comments: nestedComments });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving comments", error: err.message });
    }
};


const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.userId;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting comment", error: err.message });
    }
};

const getCommentsByUser = async (req, res) => {
    const userId = req.user.userId;

    try {
        const comments = await Comment.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ message: "User comments retrieved", comments });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user comments", error: err.message });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment,
    getCommentsByUser
};
