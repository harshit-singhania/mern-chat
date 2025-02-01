import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewear/auth.middlewear.js';

const router = express.Router();

router.post('/signup', signup); 

router.post('/login', login);

router.post('/logout', logout);

// update profile first we check the profile and then update the profile if signed in
router.put('/profile', protectRoute, updateProfile);

export default router;