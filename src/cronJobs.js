import mongoose from 'mongoose';
import Status from './models/statusModel.js'; // Ajusta la ruta si es necesario
import connectToMongoDB from './db/mongoConnection.js'; // Importa la función para conectar a MongoDB
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

// Conectar a MongoDB
connectToMongoDB();

// Función para eliminar estados antiguos
const deleteOldStatuses = async () => {
    console.log('Running cron job to delete old statuses...');
    try {
        // Calcula el tiempo límite (24 horas atrás)
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - 24);

        // Elimina los estados que son más viejos que el límite de tiempo
        const result = await Status.deleteMany({ createdAt: { $lt: timeLimit } });
        console.log(`${result.deletedCount} statuses deleted.`);
    } catch (error) {
        console.error('Error deleting old statuses:', error.message);
    }
};

// Ejecuta la tarea cada 24 horas (86400000 milisegundos)
setInterval(deleteOldStatuses, 86400000);

// Ejecuta inmediatamente al iniciar (opcional)
deleteOldStatuses();
