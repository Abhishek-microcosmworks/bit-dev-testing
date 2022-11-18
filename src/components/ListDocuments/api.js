import openSocket from 'socket.io-client';

//https://googledrivebk.plugin.vlogr.com/auth-code
//auth-code
const socket = openSocket('http://localhost:7000', { withCredentials: false, transports: ['websocket'] });

function subscribeToTimer(id, callback) {
  socket.on(id, (progress_state, progress) => callback(null, progress_state, progress));
}
function sendForm(jsonObject) {
  socket.emit('download-google-photos', JSON.stringify(jsonObject))
}
export { subscribeToTimer };
export { sendForm };