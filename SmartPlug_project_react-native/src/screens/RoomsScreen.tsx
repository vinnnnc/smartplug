import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import styles from '../styles/styles';
import React, { useContext, useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context, room } from '../components/ContextProvider';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import axios from 'axios';
// import NfcManager, {
//   NfcEvents,
//   NfcTech,
//   TagEvent,
// } from 'react-native-nfc-manager';

const Rooms = () => {
  const { roomList, setRoomList } = useContext(Context);
  const { smartplugList, setSmartplugList } = useContext(Context);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [nfcIndex, setNfcIndex] = useState(0);

  const handleToggleEnabled = async (roomIndex: number) => {
    try {
      console.log(roomIndex);
      const newRoomList = [...roomList];
      newRoomList[roomIndex].enabled = !newRoomList[roomIndex].enabled;
      setRoomList(newRoomList);

      smartplugList.forEach(async (item, index) => {
        console.log(
          smartplugList[index].ipAddress + ':' + smartplugList[index].room,
        );
        if (smartplugList[index].room == roomIndex) {
          try {
            const url = `http://${smartplugList[index].ipAddress}/${newRoomList[roomIndex].enabled ? 'on' : 'off'
              }`;
            await axios.post(url);
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleWaitNFC = async () => {
  //   try {
  //     // register for the NFC tag with NDEF in it
  //     await NfcManager.requestTechnology(NfcTech.MifareClassic);
  //     // the resolved tag object will contain `ndefMessage` property
  //     const tag = await NfcManager.getTag();
  //     console.log('Tag found', tag);
  //     handleToggleEnabled(12);
  //   } catch (ex) {
  //     console.log('Oops!', ex);
  //   } finally {
  //     // stop the nfc scanning
  //     NfcManager.cancelTechnologyRequest();
  //   }
  // };

  // useEffect(() => {
  //   NfcManager.isSupported()
  //     .then(supported => {
  //       setIsNfcSupported(supported);
  //       if (supported) {
  //         NfcManager.start();
  //       }
  //     })
  //     .catch(err => console.warn(err));

  //   return () => {
  //     if (isNfcSupported) {
  //       // NfcManager.stop();
  //     }
  //   };
  // }, [isNfcSupported, roomList]);

  // useEffect(() => {
  //   if (isNfcSupported) {
  //     NfcManager.registerTagEvent();
  //     NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
  //       console.log('NFC tag detected:', tag);
  //       // Do something with the tag data here
  //       handleToggleEnabled(nfcIndex);
  //     });
  //   }

  //   return () => {
  //     if (isNfcSupported) {
  //       NfcManager.unregisterTagEvent();
  //       NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  //     }
  //   };
  // }, [isNfcSupported, roomList]);

  const renderItem = ({ item, index }: { item: room; index: number }) => (
    <Pressable
      onLongPress={() => Alert.alert('Under development.')}
      style={[styles.item]}>
      <View style={[styles.horizontal, { alignSelf: 'flex-start' }]}>
        <MaterialIcons name={'meeting-room'} size={100} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 35, lineHeight: 35 }}>{item.roomName}</Text>
          <Text>{item.deviceCount} Device/s</Text>
        </View>
      </View>
      <Pressable
        style={[{ right: 30, top: 50, position: 'absolute' }]}
        onPress={() => handleToggleEnabled(index)}>
        <MaterialIcons
          name={'power-settings-new'}
          size={50}
          style={[
            styles.toggleButton,
            item.enabled ? styles.onButton : styles.offButton,
          ]}
        />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.listContainer}>
      {roomList.length === 0 ? (
        <View
          style={[
            styles.container,
            {
              flexDirection: 'row',
            },
          ]}>
          <Text>Press </Text>
          <MaterialIcons name="add-circle-outline" size={30} color={'#BBB'} />
          <Text> to add a Room.</Text>
        </View>
      ) : (
        <FlatList
          data={roomList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.roomName}-${index}`}
        />
      )}
    </View>
  );
};

export default Rooms;
