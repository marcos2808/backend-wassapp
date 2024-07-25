import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
},{ timestamps: true})

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
