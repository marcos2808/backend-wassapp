import Message from "../models/messageModel.js";

class MessageController{

    //funcion para guardar los mensajes 
    async save (req, res){
        try {
            const {message, from} = req.body;    
            const save = new Message({message, from});
            save.save();
            return res.status(200).send({
                status: 'Success',
                message
            })
        } catch (e) {            
            return res.status(404).send({
                status: 'error',
                message: e.message
            })
        }
    }

    //funcion para obtener todos los mensajes 
    async getMessages(req, res){
        try {
            const messages = await Message.find({})
            return res.status(200).send({
                status: 'Success',
                messages
            })
        } catch (e) {
            return res.status(404).send({
                status: 'error',
                message: e.message
            })
        }
    }


}

export default MessageController;