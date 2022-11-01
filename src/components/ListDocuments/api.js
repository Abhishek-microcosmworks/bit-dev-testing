import openSocket from 'socket.io-client';

const socket = openSocket('https://googledrivebk.plugin.vlogr.com/', { withCredentials: false, transports: ['websocket'] });

function subscribeToTimer(id, callback) {
  socket.on(id, (progress_state, progress) => callback(null, progress_state, progress));
}

function sendForm(jsonObject) {
  socket.emit('download-drive', JSON.stringify(jsonObject))
  console.log(jsonObject)
}

export { subscribeToTimer };
export { sendForm };