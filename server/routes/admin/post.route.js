import express from 'express';

import * as postController from '../../controllers/admin/post.controller.js';

const router = express.Router();

router.get('/listPosts', postController.getAllPosts);

router.get('/detail/:postId', postController.getPostById); // Cũng không cần thiết

router.get('/total-pages', postController.getTotalPages); // Không cần thiết

router.patch('/warn/:postId', postController.warnPost);

router.patch('/delete/:postId', postController.deletePost);

router.patch('/recover/:postId', postController.recoverPost);

export default router;