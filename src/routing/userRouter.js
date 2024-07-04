import { Router } from "express";
import UserController from "../controllers/userController.js";



const userRouter = Router();

userRouter.post("/createUser", UserController.createUser);
userRouter.delete("/deleteUser", UserController.deleteUser);
userRouter.put("/updatePassword", UserController.updatePassword);
userRouter.put("/updateEmail", UserController.updateEmail);

export default userRouter;

