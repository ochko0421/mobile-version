import React from 'react';
import { View } from 'react-native';
import Map from './Map';

export default function HomeScreen() {

  const traffic = false;
  const style = {
    width: "100%",
    height: 700
  }
  return (
    <View style={{ position: "relative" }}>
      <Map
        traffic={traffic}
        style={style}
        activeTab="location" />

    </View>
  );
}


