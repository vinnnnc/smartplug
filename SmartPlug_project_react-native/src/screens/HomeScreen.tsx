import {
  Alert,
  Button,
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import styles from '../styles/styles';
import React, { useContext, useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context, smartplug } from '../components/ContextProvider';
import axios from 'axios';
// import BackgroundTask from 'react-native-background-task';

const Home = () => {
  const { update, setUpdate } = useContext(Context);
  const { smartplugList, setSmartplugList } = useContext(Context);

  // BackgroundTask.define(() => {
  //   console.log('Hello from a background task')
  //   BackgroundTask.finish()
  // })


  const handleToggleEnabled = async (index: number) => {
    try {
      const newSmartplugList = [...smartplugList];
      // const newRelayState = smartplugList[index].enabled;
      const url = `http://${smartplugList[index].ipAddress}/${smartplugList[index].enabled ? 'off' : 'on'
        }`;
      await axios.post(url);
      newSmartplugList[index].enabled = !newSmartplugList[index].enabled;
      setSmartplugList(newSmartplugList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRelayState = async () => {
    const update = [...smartplugList];
    smartplugList.forEach(async (item, index) => {
      try {
        const response = await fetch(
          `http://${smartplugList[index].ipAddress}/state`,
          {
            method: 'GET',
          },
        );
        const state = await response.text();
        update[index].online = true;
        update[index].enabled = state === 'on';
      } catch {
        update[index].online = false;
      }
    });
    setSmartplugList(update);
  };

  const minCols = 2;

  const calcNumColumns = (width: number) => {
    const cols = width / styles.item.height;
    const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
    const colsMinusMargin = cols - 2 * colsFloor * styles.item.margin;
    if (colsMinusMargin < colsFloor && colsFloor > minCols) {
      return colsFloor - 1;
    } else return colsFloor;
  };

  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(calcNumColumns(width));

  const renderItem = ({ item, index }: { item: smartplug; index: number }) => (
    <Pressable
      onLongPress={() => Alert.alert('Under development.')}
      delayLongPress={500}
      style={[styles.item, item.online ? styles.online : styles.offline]}>
      <View style={styles.itemDetails}>
        <Text style={styles.title}>{item.deviceName}</Text>
      </View>
      <Text>
        {/* {item.ipAddress} */}
        {!item.online && 'offline'}
      </Text>
      <View style={styles.horizontal}>
        <Pressable
          onPress={() => handleToggleEnabled(index)}
          disabled={item.online ? false : true}>
          <MaterialIcons
            name={'power-settings-new'}
            size={50}
            style={[
              styles.toggleButton,
              item.enabled ? styles.onButton : styles.offButton,
            ]}
          />
        </Pressable>
      </View>
    </Pressable>
  );

  useEffect(() => {
    setNumColumns(calcNumColumns(width));
    if (update) {
      const interval = setInterval(() => {
        handleRelayState();
        console.log(update);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [{ width, update }]);

  return (
    <View style={styles.listContainer}>
      {smartplugList.length === 0 ? (
        <View
          style={[
            styles.container,
            {
              flexDirection: 'row',
            },
          ]}>
          <Text>Press </Text>
          <MaterialIcons name="add-circle-outline" size={30} color={'#BBB'} />
          <Text> to add a Device.</Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={smartplugList}
          renderItem={renderItem}
          numColumns={numColumns}
          keyExtractor={(item, index) => `${item.deviceName}-${index}`}
        />
      )}
    </View>
  );
};

export default Home;
