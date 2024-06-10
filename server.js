const express = require('express');
const http = require('http'); 

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

const PORT = process.env.PORT || 4000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomData() {
    const coordinates = [
        [110.3738222, -7.7659456],
        [110.36963439175416, -7.7496238],
        [110.415648, -7.801391],
        [110.422173, -7.808887],
        [110.429569, -7.796569],
        [110.444572, -7.780294],
        [110.450119, -7.767698],
        [110.457886, -7.762510],
        [110.465653, -7.775210],
        [110.373765, -7.759205]
    ];

    const locations = [
        "Yogyakarta",
        "Sleman",
        "Bantul",
        "Kulon Progo",
        "Gunung Kidul",
        "Wonosari",
        "Piyungan",
        "Pakem",
        "Berbah",
        "Godean"
    ];

    return coordinates.map((coord, index) => {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coord
            },
            properties: {
                location: locations[index],
                air_quality_index: getRandomInt(50, 150),
                pm10: getRandomInt(20, 80),
                pm2_5: getRandomInt(10, 50),
                o3: getRandomInt(30, 100),
                no2: getRandomInt(10, 50),
                so2: getRandomInt(5, 20),
                co: (Math.random() * (2 - 0.5) + 0.5).toFixed(1),
                timestamp: new Date().toISOString()
            }
        };
    });
}

io.on('connection', (socket) => {
    console.log('A client connected');

    const emitData = () => {
        const data = {
            type: "FeatureCollection",
            features: generateRandomData()
        };
        socket.emit('geoinfo', data);
    };

    const dataInterval = setInterval(emitData, 2000);

    socket.on('disconnect', () => {
        console.log('A client disconnected');
        clearInterval(dataInterval);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
