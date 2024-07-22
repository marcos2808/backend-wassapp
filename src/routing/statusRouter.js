import { Router } from "express";
import { createStatus, getAllStatuses } from "../controllers/statusController.js";
import authMiddleware from "../controllers/authController.js";
import { authenticateToken } from '../controllers/authController.js';
import multer from "multer";

const upload = multer();
const router = Router();


router.post('/create', authenticateToken, upload.single('image'), createStatus);
router.get('/all', getAllStatuses);

export default router;
