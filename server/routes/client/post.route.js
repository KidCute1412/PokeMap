import express from "express";
import * as postController from "../..//controllers/client/post.controller.js";
import {upload} from "../../config/cloudinary.config.js";
import {verifyToken, justDecodeToken} from "../../middlewares/auth.middlewares.js";

const route = express.Router ();


route.post("/create", verifyToken, upload.array("images", 10), postController.createPost); // done
route.get("/posts", postController.getPosts); // not done, need to implement ajax loading
route.get("/get_user_post", justDecodeToken, postController.getUserPosts); // query userId  // done
route.post("/:postId/like", verifyToken, postController.likePost); // done
route.post("/:postId/comment", postController.commentOnPost);
route.delete("/posts/:postId", postController.deletePost);
route.post("/:postId/follow", verifyToken, postController.followUserFromPost);


export default route;