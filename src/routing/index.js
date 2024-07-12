import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import messageRouter from "./messagesRouter.js";


const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/messages', messageRouter);

export default router