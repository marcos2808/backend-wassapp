import express, { Router } from 'express';
import MessageController from '../controllers/messageController.js';
import authenticate from '../middlewares/authMiddlewares.js';

const messageRouter = Router();

messageRouter.use(authenticate);

//definicion de rutas
messageRouter.post('/save', MessageController.save);
messageRouter.get('/getMessages', MessageController.getMessages);

export default messageRouter;



