import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';
/**Api config */
export const API_URI = 'http://192.168.1.8:5000';

/**Socket config */
export const socke = IO(API_URI, {
  forceNew: true,
});
socke.on('connection', () => {
  console.log('Connected client ');
});
// const peerServer = new Peer(undefined, {
//   host: '192.168.1.8',
//   secure: false,
//   port: 5000,
//   path: '/mypeer',
// });

// peerServer.on('error', () => {
//   console.log('error');
// });
export const joinRoom = (stream) => {};

function connectToUser() {}
