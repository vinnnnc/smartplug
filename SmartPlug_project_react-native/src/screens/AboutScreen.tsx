import { Text, View } from 'react-native';
import styles from '../styles/styles';
import React from 'react';
import { Image } from 'react-native-elements';

const About = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>
        <Image
          style={{
            width: 200,
            height: 200,
          }}
          source={require('../img/logo.png')}
        />
        <Text style={{ fontSize: 35, lineHeight: 35 }}>SmartPlug App</Text>
        <Text style={{ fontSize: 20, lineHeight: 35, margin: 5 }}>Group 10</Text>
        <Text style={{ margin: 3 }}>Vincent Bautista</Text>
        <Text style={{ margin: 3 }}>Jhon Ray Reyes</Text>
        <Text style={{ margin: 3 }}>Manuel Reyes</Text>
        <Text style={{ margin: 3 }}>Jenmark Manolid</Text>
      </View>
    </View>
  );
};

export default About;
