import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import connectDB from './src/db/mongoConnection.js';
import corsMiddleware from './src/middlewares/corsMiddlewares.js';
import router from './src/routing/index.js';

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
    
    io.on('connection', (socket) => {
        console.log('Nueva conexión de cliente:', socket.id);

        socket.on('message',(message, nickname) => {
            //envio al resto de clientes conectados 
            socket.broadcast.emit('messages', {
                body: message,
                from: nickname
            })
        })
    });

    server.listen(port, () => {
        console.log(`El servidor de Wassapp está esperando su petición en el puerto ${port}`);
    });
} catch (error) {
    console.error('Servidor no responde', error);
}
