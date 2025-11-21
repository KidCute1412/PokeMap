import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import connectDatabase from './config/database.config.js';
import { initSocket } from './services/socket.service.js';
import clientRouter from './routes/client/index.route.js';

const app = express();
const PORT = 10000;

const server = http.createServer(app);
const io = new Server(server);
initSocket(io);

connectDatabase();

app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.use("/api", clientRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});