const { Favorite } = require('../models/models');

const addFavorite = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId;

    try {
        
        const alreadyExists = await Favorite.findOne({ userId, postId });
        if (alreadyExists) {
            return res.status(400).json({ message: "Post already favorited" });
        }

        
        const newFavorite = new Favorite({ userId, postId });
        await newFavorite.save();

        console.log("Favorite added successfully", newFavorite);
        return res.status(201).json({ message: "Favorite added successfully" });
    } catch (error) {
        console.error("Error occurred while adding favorite:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteFavorite = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId;

    try {
        const existingFavorite = await Favorite.findOneAndDelete({ userId, postId });

        if (!existingFavorite) {
            return res.status(404).json({ message: "Favorite not found for this post" });
        }

        return res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
        console.error("Error removing favorite:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getFavoritePosts = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Step 1: Get favorite docs by userId and populate post info
    const favorites = await Favorite.find({ userId }).populate('postId');

    // Step 2: Extract the populated post data
    const favoritePosts = favorites
      .map(fav => fav.postId)
      .filter(post => post !== null); // in case the post was deleted

    return res.status(200).json({
      message: 'Favorite posts retrieved successfully',
      posts: favoritePosts
    });
  } catch (error) {
    console.error('Error retrieving favorite posts:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};




module.exports = { addFavorite,deleteFavorite,getFavoritePosts };
