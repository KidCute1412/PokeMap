import * as commentService from './comment.service.js';

export function initSocket(io) {
    io.on("connection", (socket) => {
        // User joins post room để nhận real-time updates
        socket.on("join_post", (postId) => {
            socket.join(`post_${postId}`);
        });

        // User leaves post room
        socket.on("leave_post", (postId) => {
            socket.leave(`post_${postId}`);
        });

        // Comment mới được tạo
        socket.on("new_comment", async (data) => {
            try {
                const { postId, userId, content, images, parentCommentId } = data;

                // Lưu comment vào database
                const comment = await commentService.createComment({
                    postId,
                    userId,
                    content,
                    images: images || [],
                    parentCommentId: parentCommentId || null
                });

                // Lấy full comment info
                const populatedComment = await commentService.getCommentById({
                    commentId: comment._id
                });

                // Broadcast comment mới tới tất cả clients trong post room
                io.to(`post_${postId}`).emit("comment_added", {
                    success: true,
                    data: populatedComment,
                    isReply: !!parentCommentId
                });
            } catch (error) {
                socket.emit("comment_error", {
                    success: false,
                    message: error.message
                });
            }
        });

        // Update comment
        socket.on("update_comment", async (data) => {
            try {
                const { commentId, userId, content, images, postId } = data;

                const comment = await commentService.updateComment({
                    commentId,
                    userId,
                    content,
                    images: images || []
                });

                const populatedComment = await commentService.getCommentById({
                    commentId: comment._id
                });

                io.to(`post_${postId}`).emit("comment_updated", {
                    success: true,
                    data: populatedComment
                });
            } catch (error) {
                socket.emit("comment_error", {
                    success: false,
                    message: error.message
                });
            }
        });

        // Delete comment
        socket.on("delete_comment", async (data) => {
            try {
                const { commentId, userId, postId } = data;

                await commentService.deleteComment({
                    commentId,
                    userId
                });

                io.to(`post_${postId}`).emit("comment_deleted", {
                    success: true,
                    commentId: commentId
                });
            } catch (error) {
                socket.emit("comment_error", {
                    success: false,
                    message: error.message
                });
            }
        });

        // Toggle like comment (like/unlike)
        socket.on("toggle_like_comment", async (data) => {
            try {
                const { commentId, postId, userId } = data;

                const result = await commentService.toggleLikeComment({
                    commentId,
                    userId
                });

                io.to(`post_${postId}`).emit("comment_like_toggled", {
                    success: true,
                    commentId: commentId,
                    likedBy: result.comment.likedBy,
                    likesCount: result.likesCount,
                    liked: result.liked
                });
            } catch (error) {
                socket.emit("comment_error", {
                    success: false,
                    message: error.message
                });
            }
        });

        socket.on("disconnect", () => {
            // Client disconnected
        })
    })
}