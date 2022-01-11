const express = require('express');
const socketIO = require('socket.io');
const axios=require("axios");
const PORT = process.env.PORT || 9000;
const INDEX = '/index.html';
const moment=require("moment");
const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, { cors: { orgins: '*' } });

io.on('connection', (socket) => {
  console.log('Client connected');
  const data = axios
    .get('https://api.ajansspor.com/apiv2/matches/soccer/getLiveMacthes', { params: { date: moment(new Date()).format("DD-MM-YYYY") } })
    .then((result) => {
      socket.emit('real', result.data.liveMatches);
    })
    .catch((error) => error.message);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
