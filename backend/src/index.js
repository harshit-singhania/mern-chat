// const express = require('express');
import express from 'express';
import authRoutes from './routes/auth.route.js';
const app = express();

// PORT = 5001 

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', authRoutes);

app.listen(5001, () => {
    console.log(`Server is running on port 5001`);
})