import Status from '../models/statusModel.js';
import bucket from '../db/firebase-admin.js'; // Asegúrate de que bucket esté configurado correctamente

export const createStatus = async (req, res) => {
    try {
        const image = req.file;
        const { userId } = req.body; // Asegúrate de que el userId se pase en el body

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
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            // Guardar el estado en MongoDB
            const status = new Status({ userId, imageUrl });
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
      const statuses = await Status.find().populate('userId', 'email'); // Opcional: incluir detalles del usuario
      res.status(200).json(statuses);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};