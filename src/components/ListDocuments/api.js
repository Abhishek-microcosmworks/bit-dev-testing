import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:7000', { withCredentials: false, transports: ['websocket'] });

function subscribeToTimer(id, callback) {
  socket.on(id, (progress_state, progress) => callback(null, progress_state, progress));
}

function sendForm(jsonObject) {
  socket.emit('download-google-photos', JSON.stringify(jsonObject))
}

export { subscribeToTimer };
export { sendForm };