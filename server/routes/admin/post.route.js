import express from 'express';

import * as postController from '../../controllers/admin/post.controller.js';

const router = express.Router();

router.get('/listPosts', postController.getAllPosts);

router.get('/detail/:postId', postController.getPostById);

router.get('/total-pages', postController.getTotalPages);

router.patch('/warn/:postId', postController.warnPost);

router.patch('/delete/:postId', postController.deletePost);

export default router;