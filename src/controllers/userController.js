import User from "../models/userModel.js";
import bucket from "../db/firebase-admin.js";
import multer from "multer";

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('profileImage');

class UserController {
    static async createUser(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file.' });
            }

            const { email, password } = req.body;

            // Validación de datos
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required to create a user." });
            }

            // Validación de imagen de perfil
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: "Profile image is required." });
            }

            try {
                // Verificar si el usuario ya existe
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already exists." });
                }

                // Subir imagen a Firebase Storage
                const blob = bucket.file(`profileImages/${Date.now()}_${file.originalname}`);
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                blobStream.on('error', (error) => {
                    console.error(error);
                    return res.status(500).json({ message: 'Error uploading image.' });
                });

                blobStream.on('finish', async () => {
                    const profileImageUrl = await blob.getSignedUrl({
                        action: 'read',
                        expires: '03-01-2500'
                    });

                    // Crear usuario
                    const user = new User({
                        email,
                        password,
                        profileImage: profileImageUrl[0] // Almacenar la URL de la imagen en la base de datos
                    });

                    await user.save();
                    res.status(201).json({ message: "User created successfully." });
                });

                blobStream.end(file.buffer);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }

    static async deleteUser(req, res) {
        const id = req.user._id;

        if (!id) return res.status(400).json({ message: "Id is required to delete a user." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            user.deleted = true;
            await user.save();
            res.status(200).json({ message: `${user.email} was deleted successfully.` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updatePassword(req, res) {
        const id = req.user._id;
        const { newPassword } = req.body;

        if (!id) return res.status(400).json({ message: "Id is required to update a user's password." });
        if (!newPassword) return res.status(400).json({ message: "New password is required to update a user's password." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const passwordMatch = await user.comparePassword(newPassword);
            if (passwordMatch) return res.status(400).json({ message: "New password cannot be the same as the old password." });

            user.password = newPassword;
            await user.save();

            res.status(200).json({ message: `${user.email}'s password updated successfully.` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateEmail(req, res) {
        const id = req.user._id;
        const { newEmail } = req.body;

        if (!id) return res.status(400).json({ message: "Id is required to update a user's email." });
        if (!newEmail) return res.status(400).json({ message: "New email is required to update a user's email." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const emailMatch = await user.compareEmail(newEmail);
            if (emailMatch) return res.status(400).json({ message: "New email is the same as the old email. No changes made." });

            user.email = newEmail;
            await user.save();

            res.status(200).json({ message: `User ${user.email}'s email updated successfully.` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default UserController;
