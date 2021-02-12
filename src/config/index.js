import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';
/**Api config */
export const API_URI = 'http://192.168.1.8:5000';

/**Socket config */
export const socket = IO(API_URI, {
  forceNew: true,
});
socket.on('connection', () => {
  console.log('Connected client ');
});
const peerServer = new Peer(undefined, {
  host: '192.168.1.8',
  secure: false,
  port: 5000,
  path: '/mypeer',
});

// peerServer.on('error', () => {
//   console.log('error');
// });
export const joinRoom = (stream) => {
  const roomID = '3lcxarj3i15blk3510xvbryq';
  peerServer.on('open', (userID) => {
    socket.emit('join-room', {userID, roomID});
  });
  socket.on('user-connected', (userID) => {
    connectToNewUser(userID, stream);
  });
  //recieve a call
  peerServer.on('call', (call) => {
    call.answer(stream);

    //stream back to call
    call.on('stream', (stream) => {
      //dispatch addstream
    });
  });
};

function connectToNewUser(useriId, stream) {
  const call = peerServer.call(useriId, stram);
  call.on('stream', (remoteVideoStream) => {
    if (remoteVideoStream) {
      //dispatch add remote video stream
    }
  });
}
