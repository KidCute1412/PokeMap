import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    useEffect(() => {
        // Khởi tạo socket nếu chưa có
        if (!socket) {
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:10000';
            console.log('🔧 Initializing socket connection to', socketUrl);
            
            socket = io(socketUrl, {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5,
                transports: ['websocket', 'polling'],
                withCredentials: true
            });

            socket.on('connect', () => {
                console.log('✅ Socket connected:', socket.id);
                setIsConnected(true);
                setConnectionStatus('connected');
            });

            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setIsConnected(false);
                setConnectionStatus('disconnected');
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setConnectionStatus('error');
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        return () => {
        };
    }, []);

    return { socket, isConnected, connectionStatus };
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
