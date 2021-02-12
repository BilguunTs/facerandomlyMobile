import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {mediaDevices, RTCView} from 'react-native-webrtc';
//import {joinRoom} from './config';

import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';
/**Api config */
const API_URI = 'http://192.168.1.8:5000';

/**Socket config */
const socket = IO(API_URI, {
  forceNew: true,
});
socket.on('connection', () => {
  console.log('Connected client ');
});

const Main = () => {
  const [myStream, setMyStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const addStream = (newStream) => {
    setStreams([...streams, newStream]);
  };
  const addMyStream = (stream) => {
    setMyStream(stream);
  };
  const addRemoteStreams = (remoteStream) => {
    setRemoteStreams([...remoteStreams, remoteStream]);
  };

  const peerServer = new Peer(undefined, {
    host: '192.168.1.8',
    secure: false,
    port: 5000,
    path: '/mypeer',
  });

  // peerServer.on('error', () => {
  //   console.log('error');
  // });
  const joinRoom = (stream) => {
    const roomID = '3lcxarj3i15blk3510xvbryq';

    //set my ownstream
    addMyStream(stream);

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
        addStream(stream);
      });
    });
  };

  function connectToNewUser(useriId, stream) {
    const call = peerServer.call(useriId, stream);
    call.on('stream', (remoteVideoStream) => {
      if (remoteVideoStream) {
        //dispatch add remote video stream
        addRemoteStreams(remoteVideoStream);
      }
    });
  }

  useEffect(() => {
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then((stream) => {
          joinRoom(stream);
        })
        .catch((error) => {
          // Log error
        });
    });
  }, []);

  return (
    <View>
      <View style={{flex: 1}}>
        {myStream ? (
          <RTCView
            streamURL={myStream.toURL()}
            style={{width: 300, height: 300}}
          />
        ) : null}
      </View>
      <View style={{flex: 1}}>
        <ScrollView horizontal>
          {streams.length > 0
            ? streams.map((stream, index) => {
                return (
                  <View key={index} style={{height: 200, width: 200}}>
                    <RTCView
                      streamURL={stream.toURL()}
                      style={{width: 180, height: 180}}
                    />
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default Main;
