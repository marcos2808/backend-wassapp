import express from 'express';
import connectDB from './src/db/mongoConnection.js'
import corsMiddleware from './src/middlewares/corsMiddlewares.js';
import router from './src/routing/index.js';

try {

    const app = express();
    await connectDB();
    
    app.use(express.json());
    app.use(corsMiddleware);
    app.use('/api', router);
     
    const port = process.env.PORT || 8000
    app.listen(port,() => console.log('El servidor de Wassapp esta esprando su peticion'));
} catch (error) {
    console.error('Servidor no responde');
    
}