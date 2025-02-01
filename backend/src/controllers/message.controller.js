
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// fetch every single user except self 
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id; 
        const filteredUsers = await User.find({
            _id: {$ne: loggedInUser}
        })

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get messages between two users
export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const senderId = req.use._id;
        const messages = await Message.find({
            // find all the messages where i am the sender or 
            // i am the receiver
            $or: [
                { senderId: senderId, receiverId:userToChatId },
                { senderId: userToChatId, receiverId: senderId } 
            ]

        }) ;
        res.status(200).json(messages);
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}

export const sendMessage = async (req, res) => {
    // text or image message
    try {
        const { text, image } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        // check if user sends an image 
        let imageUrl; 
        if (image) {
            // upload the image to cloudinary
            const imageUploadResponse = await cloudinary.uploader.upload(image) 
            imageUrl = imageUploadResponse.secure_url
        }

        // create a new message
        const newMessage = new Message({
            senderId: senderId, 
            receiverId: receiverId, 
            text: text,
            image: imageUrl, 
        })

        await newMessage.save();

        // TODO: send realtime messages using socketio

        res.status(200).json(newMessage);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}