const {Post}=require('../models/models');

const createPost = async (req, res) => {
    const { title, category, content } = req.body;
    
    // Fix: Get userId from the decoded token
    const userId = req.user.id; // Use 'id' instead of '_id' based on your JWT payload
    
    try {
        const post = new Post({
            userId,
            title,
            category,
            content,
            // Fix: Structure the image object correctly to match schema
            ...(req.file && {
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            })
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const deletePost=async(req,res)=>{
    const postId=req.params.postId;
    try{
        const existingpost=await Post.findById(postId);
        if(!existingpost)
        {
            return res.status(404).json({message:"Post not found"});
        }
        await Post.findByIdAndDelete(postId);
        return res.status(200).json({message:"Post deleted successfully"});
    }
    catch(error)
    {
        console.error("Error deleting post:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const getPostsByuser=async(req,res)=>{
    const userId=req.user.id;

    try{
        const posts=await Post.find({userId}).sort({createdAt:-1});
        if(posts.length===0)
        {
            return res.status(404).json({message:"No posts found"});
        }
        console.log("Posts retrieved:", posts);
        return res.status(200).json({message:"Posts retrieved successfully",posts});

    }
    catch(error)
    {
        console.error("Error retrieving posts:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const getPostById = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user?.id;

    try {
        console.log("Fetching post with ID:", postId);
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.viewers.includes(userId)) {
            post.views += 1;
            post.viewers.push(userId); 
            await post.save();
        }

        console.log("Post retrieved:", post);
        return res.status(200).json({ message: "Post retrieved successfully", post });
    } catch (error) {
        console.error("Error retrieving post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const getallposts=async(req,res)=>{
    
    try{
        const posts=await Post.find().sort({createdAt:-1});
        if(posts.length===0)
        {
            return res.status(404).json({message:"No posts found"});
        }
        console.log("All posts retrieved:", posts);
        return res.status(200).json({message:"All posts retrieved successfully",posts});    
    }
    catch(error)
    {
        console.error("Error retrieving all posts:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}
module.exports={createPost,deletePost,getPostsByuser,getPostById,getallposts};

