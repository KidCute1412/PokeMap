import express from "express";
import * as userController from "../../controllers/client/user.controller.js";
const router = express.Router();


router.get("/profile", userController.getUserProfile);


export default router;