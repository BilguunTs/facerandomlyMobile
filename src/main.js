import React, {useEffect} from 'react';
import {mediaDevices} from 'react-native-webrtc';
import {joinRoom} from './config';
const Main = () => {
  useEffect(() => {
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos);
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

  return null;
};

export default Main;
