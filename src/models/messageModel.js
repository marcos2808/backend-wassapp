import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        unique: false
    }, 
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{ timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message;
