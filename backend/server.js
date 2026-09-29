require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');

//middleware
app.use(express.json());
app.use(morgan('common'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));


const port = 5000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        throw error;
    }
};

const start = async () => {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Başlatma hatası:", error);
        process.exit(1);
    }
};

start();