import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import connectDatabase from './config/database.config.js';
import { initSocket } from './services/socket.service.js';

const app = express();
const PORT = 10000;

const server = http.createServer(app);
const io = new Server(server);
initSocket(io);

connectDatabase();

app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});