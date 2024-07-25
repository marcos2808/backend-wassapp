import { Router } from "express";
import ChatController from "../controllers/chatController.js";
import authenticate from "../middlewares/authMiddlewares.js";

const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get("/", ChatController.getChats);
chatRouter.get("/:id/messages", ChatController.getChatMessages);

export default chatRouter;

