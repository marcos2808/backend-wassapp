import Message from "../models/messageModel.js";

class MessageController{

    //funcion para guardar los mensajes 
    async save (req, res){
        const {message, from} = req.body;

        const save = new Message({message, from});
        save.save((error, messageStored) =>{
            if(error || !messageStored){
                return res.status(404).send({
                    status: 'error',
                    message: 'It could not save the message.'
                })
            }

            return res.status(200).send({
                status: 'Success',
                messageStored
            })
        });
    }

    //funcion para obtener todos los mensajes 
    async getMessages(req, res){
        
        var query = Message.find({})
        query.sort('_id').exec((error, messages) =>{
            if (error){
                return res.status(500).send({
                    status: 'error',
                    messge: 'Error extracting data.'
                })
            }
            if (!messages){
                return res.status(404).send({
                    status: 'error',
                    messge: 'There are no messages to display.'
                })
            }

            return res.status(200).send({
                status: 'Success',
                messages
            })
        })
    }


}

export default MessageController;