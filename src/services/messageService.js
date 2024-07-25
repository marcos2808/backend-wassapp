import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const createChatMessage = async ({ message, from, chat }) => {
    const newMessage = new Message({ message, from });
    if (!newMessage){
        throw new Error('El mensaje no existe.')
    }
    await newMessage.save();
    const currentChat = await Chat.findOne({ _id: chat })
    if (!currentChat){
        throw new Error('El chat no existe.')
    }
    currentChat.messages.push(newMessage._id)
    await currentChat.save()
}