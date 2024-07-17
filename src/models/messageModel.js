import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        unique: false
    }, 

    from: {
        type: String,
        required: true,
        unique: false
    }
},{ timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message;
