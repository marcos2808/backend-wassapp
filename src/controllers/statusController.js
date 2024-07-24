import Status from '../models/statusModel.js';
import bucket from '../db/firebase-admin.js'; // Asegúrate de que bucket esté configurado correctamente
import jwt from 'jsonwebtoken'; // Importa jwt para verificar el token
import User from '../models/userModel.js';


export const createStatus = async (req, res) => {
    try {
        const image = req.file;
        const { userEmail, title, description } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        // Subir la imagen a Firebase Storage
        const blob = bucket.file(image.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: image.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ message: 'Unable to upload image.' });
        });

        blobStream.on('finish', async () => {
            // Obtener la URL correcta de Firebase
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

            // Guardar el estado en MongoDB
            const status = new Status({ userEmail, imageUrl, title, description });
            await status.save();

            res.status(200).json({ message: 'Status created successfully.', status });
        });

        blobStream.end(image.buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





// Función para obtener todos los estados
export const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statuses', error });
  }
};



// Función para eliminar un estado
export const deleteStatus = async (req, res) => {
  try {
      const { statusId } = req.params;
      const token = req.headers.authorization.split(' ')[1];

      if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const status = await Status.findById(statusId);

      if (!status) {
          return res.status(404).json({ message: 'Status not found.' });
      }

      if (status.userId.toString() !== userId) {
          return res.status(403).json({ message: 'You are not authorized to delete this status.' });
      }

      // Eliminar la imagen de Firebase Storage
      const fileName = status.imageUrl.split('/').pop().split('?')[0];
      await bucket.file(fileName).delete();

      // Eliminar el estado de la base de datos
      await status.deleteOne();

      res.status(200).json({ message: 'Status deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};