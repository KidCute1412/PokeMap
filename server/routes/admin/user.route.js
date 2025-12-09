import express from 'express';
        
import * as userController from '../../controllers/admin/user.controller.js';

const router = express.Router();

router.get('/listUsers', userController.getUsers);

router.get('/detailUser/:id', userController.getUserById);

router.delete('/deleteUser/:id', userController.deleteUser);

router.get('/total-pages', userController.getTotalUserPages);

router.get('/total-users', userController.getTotalUsers);

export default router;