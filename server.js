const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

// Use cors middleware to allow cross-origin requests
app.use(cors());

io.on('connection', (socket) => {
    console.log('A client connected');
    setInterval(() => {
        const data = Math.random(); // Generate random data
        socket.emit('data', data); // Send data to the client every 2 seconds
    }, 100);

    setInterval(() => {
        const data2 = Math.random(); // Generate random data
        socket.emit('data2', data2 * 2); // Send data to the client every 2 seconds
    }, 1000);

    setInterval(() => {
        const idValue = Math.floor(Math.random() * 34) + 1; // Random id from 1 to 34
        const levelValue = Math.random(); // Random level from 0 to 1
        const data = { id: idValue, level: levelValue };
        socket.emit('dataGeo', data); // Send data to the client every 2 seconds
    }, 500);

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
