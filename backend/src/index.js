// const express = require('express');
import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();

// PORT = 5001 

const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})