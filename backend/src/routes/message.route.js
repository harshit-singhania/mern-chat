import express from 'express';
import { protectRoute } from '../middlewear/auth.middlewear.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// fetch the details of all the users for the sidebar
router.get('/users', protectRoute, getUsersForSidebar); 

// get the messages between two users
router.get('/:id', protectRoute, getMessages);

// send messages 
router.post('/send/:id', protectRoute, sendMessage);

export default router;