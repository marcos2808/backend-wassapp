import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Status = mongoose.model('Status', statusSchema);

export default Status;
