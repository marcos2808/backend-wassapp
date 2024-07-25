import { Router } from "express";
import UserController from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddlewares.js";
import authenticateToken from '../middlewares/authenticateToken.js';


const userRouter = Router();

userRouter.post("/createUser", UserController.createUser);

userRouter.use(authenticate);

userRouter.delete("/deleteUser", UserController.deleteUser);
userRouter.put("/updatePassword", UserController.updatePassword);
userRouter.put("/updateEmail", UserController.updateEmail);
userRouter.get('/profile-image', authenticateToken, (req, res) => {
    const { profileImage } = req.user;

    res.status(200).json({ profileImage });
});

export default userRouter;

