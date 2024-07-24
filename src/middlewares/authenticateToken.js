import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ajusta la ruta según tu estructura

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // `Bearer <token>`

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        // Verifica y decodifica el token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Busca al usuario en la base de datos usando el ID del token
            const foundUser = await User.findById(decoded.userId);

            if (!foundUser) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

            // Imprime los datos del usuario en la consola
            console.log('User data:', foundUser);

            // Añade el usuario completo al objeto req
            req.user = foundUser;

            // Llama al siguiente middleware o controlador
            next();
        });
    } catch (error) {
        console.error('Error verifying token or finding user:', error);
        res.status(403).json({ message: 'Forbidden' });
    }
};

export default authenticateToken;
