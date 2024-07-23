import { Router } from 'express';
import { createStatus, getAllStatuses, deleteStatus } from '../controllers/statusController.js';
import AuthController from '../controllers/authController.js'; // Asegúrate de que la ruta sea correcta
import multer from 'multer';

const upload = multer();
const router = Router();

router.post('/create', AuthController.authenticateToken, upload.single('image'), createStatus);
router.get('/all', getAllStatuses);
router.delete('/status/:statusId', AuthController.authenticateToken, deleteStatus);

export default router;
