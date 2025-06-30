import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import PageHeader from '../components/PageHeader';

const WebviewScreen = () => {
  const route = useRoute();

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <PageHeader />

      <WebView
        originWhitelist={['*']}
        source={{uri: route.params?.url ?? 'https://reactnative.dev/'}}
      />
    </View>
  );
};

export default WebviewScreen;
