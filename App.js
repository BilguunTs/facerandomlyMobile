import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Main from './src/main';
const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Main />
      </SafeAreaView>
    </>
  );
};

export default App;
