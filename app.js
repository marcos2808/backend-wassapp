import 'dotenv/config.js'
import express from 'express';
import { Socket, Server as SocketServer } from 'socket.io';
import http from 'http';
import connectDB from './src/db/mongoConnection.js';
import corsMiddleware from './src/middlewares/corsMiddlewares.js';
import router from './src/routing/index.js';
import './src/cronJobs.js';
import User from './src/models/userModel.js';
import jwt from 'jsonwebtoken';
import Chat from './src/models/chatModel.js';
import { createChatMessage } from './src/services/messageService.js';

try {
    const app = express();
    await connectDB();
    
    app.use(express.json());
    app.use(corsMiddleware);
    app.use('/api', router);
    
    const port = process.env.PORT || 8000;
    
    const server = http.createServer(app);
    
    const io = new SocketServer(server, {
        cors: {
            origin: '*',
        }
    });
    // id: socket
    const users = new Map()
    let userId = ''

    io.use((socket, next) => {
        try {
            // autentificar 
            const token = socket.handshake.query.token
            if (!token) {
                throw new Error('No existe el token de autenticación.')
            }
            // Verifica y decodifica el token
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return socket.emit('error', err.message)
                }
    
                // Busca al usuario en la base de datos usando el ID del token
                const foundUser = await User.findById(decoded.userId);
    
                if (!foundUser) {
                    return socket.emit('error', 'Usuario no encontrado')
                }

                // obtener id del usuario a partir del token
                userId = foundUser.id || foundUser._id
                // agregar usuario a mapa
                if (!userId){
                    return socket.emit('error', 'Usuario no existe')
                }
                if (!users.has(userId)){
                    users.set(userId, socket)
                }
                next()
            })
        } catch (error) {
            return socket.emit('error', error.message)
        }
    })

    // sockets
    io.on('connection', (socket) => {
        socket.on('chat-message', async ({ message, chat}) => {
            try {
                const timestamp = new Date().toISOString();

                // obtener receptor a partir de id del chat
                const chatEntry = await Chat.findOne({ _id: chat })
                if (!chatEntry){
                    return socket.emit('error', 'Chat no existe')
                }
                
                const receiver = chatEntry.members.filter(m => m != userId)[0]

                const socketReceiver = users.get(receiver);
                if (socketReceiver){
                    socketReceiver.emit('chat-message', {
                        message,
                        sender: userId,
                        timestamp
                    });
                }
                // crear mensaje en chat    
                await createChatMessage({ message, from: userId, chat})

                socket.emit('message-sent', { receiver, message, timestamp })  
            } catch (error) {
                return socket.emit('error', error.message)
            }
        })

        socket.on('disconnect', () => {
            try{
                users.delete(id)
            } catch (error) {
                return socket.emit('error', error.message)
            }
        })
    });
    // sockets

    server.listen(port, () => {
        console.log(`El servidor de Wassapp está esperando su petición en el puerto ${port}`);
    });
} catch (error) {
    console.error('Servidor no responde', error);
}
