import { Router } from "express";
import UserController from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddlewares.js";



const userRouter = Router();

userRouter.use(authenticate);

userRouter.post("/createUser", UserController.createUser);
userRouter.delete("/deleteUser", UserController.deleteUser);
userRouter.put("/updatePassword", UserController.updatePassword);
userRouter.put("/updateEmail", UserController.updateEmail);

export default userRouter;

