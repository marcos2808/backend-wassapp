import Chat from '../models/chatModel.js'

class chatController {
    static async getChats(req, res) {
        try {
            // obtener id del usuario autenticado
            const userId = req.user._id
            const chats = await Chat.find({ members: userId }).populate('members')
            const result = chats.map(chat => {
                return { 
                    chat: chat._id,
                    member: chat.members.filter(m => m._id != userId.toString())[0]
                }
            })
            return res.status(200).json(result)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    static async getChatMessages(req, res) {
        try {
            const chat = await Chat.findOne({ _id: req.params.id }).populate('messages')
            if (!chat){
                throw new Error('El chat no existe.')
            }
            return res.status(200).json({
                chat: chat._id,
                messages: chat.messages
            }) 
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
}

export default chatController;
