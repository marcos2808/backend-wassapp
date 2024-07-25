import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import messageRouter from "./messagesRouter.js";
import statusRouter from "./statusRouter.js";
import chatRouter from './chatRouter.js'

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/messages', messageRouter);
router.use('/status', statusRouter);
router.use('/chats', chatRouter)

export default router