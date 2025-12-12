import uploadToCloudinary from "../../config/cloudinary.config.js";
import fs from 'fs';
import * as postService from "../../services/post.service.js";


// Example post controller functions
export const createPost = async (req, res) => {
    // Your logic here
    const content = req.body.postContent;
    const userId = req.body.userId;
    const isOwner = userId == req.user._id;
    const images = req.files; // Array of uploaded image files


    if (!content || !isOwner) {
        return res.status(400).json({ message: "Post content and user ID are required" });
    }

    let imageUrls = [];
    if (images && images.length > 0) {
        // Alternative: Use for...of loop instead of Promise.all + map
        for (const image of images) {
            const result = await uploadToCloudinary(image.path, "posts");
            console.log("Uploaded image URL:", result.secure_url);
            // Delete the local file after upload
            fs.unlinkSync(image.path);
            imageUrls.push(result.secure_url);
        }

    }

    await postService.createPost ({
        content: content,
        images: imageUrls,
        user: userId
    })


    res.json({
        status: "success",
        message: "Post created successfully"
    });
};

export const getPosts = (req, res) => {
    // Your logic here
    res.json({ message: "Create post" });
};

export const getUserPosts = async (req, res) => {
    console.log ("Fetching posts for user ID:", req.query.userId);
    const viewer = req.user || null;
    const results = await postService.getUserPosts ({userId : req.query.userId, viewer : viewer});
    console.log ("User posts fetched:", results);
    res.json ({
        status : "success",
        message : "User posts fetched successfully",
        data : results
    });
}

export const likePost = async (req, res) => {
    const postId = req.params.postId;
    await postService.likePost ({postId: postId, user: req.user});
    res.json({ message: "Post liked successfully" });
}

export const commentOnPost = (req, res) => {
    // Your logic here
    res.json({ message: "Comment on post" });
}

export const deletePost = (req, res) => {
    // Your logic here
    res.json({ message: "Delete post" });
}

export const followUserFromPost = async (req, res) => {
    // Your logic here
    const postId = req.params.postId;
    const userId = req.user._id;
    const result = await postService.followUserFromPost ({postId: postId, userId: userId});
    res.json ({
        status : "success",
        message : "Follow/unfollow action completed successfully",
    });
}


// Add more controller functions as needed