import express, { Router } from 'express';
import MessageController from '../controllers/messageController.js';
import authenticate from '../middlewares/authMiddlewares.js';

const messageRouter = Router();
const messageController = new MessageController

messageRouter.use(authenticate);

//definicion de rutas
messageRouter.post('/save', messageController.save);
messageRouter.get('/getMessages', messageController.getMessages);

export default messageRouter;



