import User from "../models/userModel.js";

class UserController {
    static async createUser(req, res) {
        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required to create a user." });
        }

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists." });
            }

            const user = new User({ email, password});
            await user.save();

            res.status(201).json({ message: "User created successfully."});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
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
