import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  useWindowDimensions,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from '../styles/styles';
import { Context, room, smartplug } from './ContextProvider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { height } = Dimensions.get('window');

type AddRoomProps = {
  closeModal(): any;
  isVisible: boolean;
};

const AddRoom = (props: AddRoomProps) => {
  const { smartplugList, setSmartplugList } = useContext(Context);
  const { roomList, setRoomList } = useContext(Context);
  const { update, setUpdate } = useContext(Context);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [tempList, setTempList] = useState<smartplug[]>([]);
  const [newRoomIndex, setNewRoomIndex] = useState(0);
  const [countSelected, setCountSelected] = useState(0);
  const minCols = 2;

  const delay = (ms: number) =>
    new Promise((resolve: any) => setTimeout(resolve, ms));

  const handleAddRoom = async (roomName: string, roomInfo: string) => {
    const newRoomList = [
      ...roomList,
      {
        roomName: roomName,
        deviceCount: countSelected,
        enabled: false,
        nfc: 0,
        timer: 0,
      },
    ];
    setRoomList(newRoomList);
    console.log('room added');
  };

  const handleSetRoom = async (smartplugIndex: number, roomIndex: number) => {
    const newList = [...tempList];
    if (newList[smartplugIndex].room == -1) {
      newList[smartplugIndex].room = roomIndex;
      setCountSelected(countSelected + 1);
    } else {
      newList[smartplugIndex].room = -1;
      setCountSelected(countSelected - 1);
    }
    setTempList(newList);
  };

  const calcNumColumns = (width: number) => {
    const cols = width / styles.item.height;
    const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
    const colsMinusMargin = cols - 2 * colsFloor * styles.item.margin;
    if (colsMinusMargin < colsFloor && colsFloor > minCols) {
      return colsFloor - 1;
    } else return colsFloor;
  };

  const renderItem = ({ item, index }: { item: smartplug; index: number }) => (
    <Pressable
      style={[
        styles.item,
        styles.online,
        item.room == -1 ? null : { backgroundColor: '#2196F3' },
      ]}
      onPress={() => {
        handleSetRoom(index, newRoomIndex);
      }}>
      <View style={styles.itemDetails}>
        <MaterialIcons
          name="lightbulb-outline"
          size={50}
          color={item.room == -1 ? '#BBB' : '#50CCF3'}
          style={[
            styles.icon,
            item.room == -1 ? null : { backgroundColor: '#30AAF3' },
          ]}
        />
        <Text style={styles.title}>{item.deviceName}</Text>
      </View>
    </Pressable>
  );

  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(calcNumColumns(width));

  useEffect(() => {
    setNumColumns(calcNumColumns(width));
  }, [{ width }]);

  const setFilteredDevices = () => {
    const newTempList = [...smartplugList];
    setTempList(newTempList.filter(newTempList => newTempList.room == -1));
  };

  const setNewRoomList = (item: smartplug[]) => {
    const newTempList = [...smartplugList];
    newTempList.forEach((oldItem, oldIndex) => {
      item.forEach((newItem, newIndex) => {
        if (oldItem.ipAddress == newItem.ipAddress) {
          newTempList[oldIndex].room = item[newIndex].room;
        }
      });
    });

    setSmartplugList(newTempList);
  };

  return (
    <Modal
      backdropOpacity={0}
      onShow={() => {
        setTempList(
          smartplugList.filter(smartplugList => smartplugList.room == -1),
        );
        setFilteredDevices();
        setUpdate(false);
        setNewRoomIndex(roomList.length);
      }}
      onDismiss={() => setUpdate(true)}
      presentationStyle={'overFullScreen'}
      isVisible={props.isVisible}
      style={{
        margin: 0,
        padding: 10,
        backgroundColor: 'white',
        minHeight: height,
      }}>
      <View style={styles.listContainer}>
        <Text style={styles.contentTitle}>Add Room</Text>
        <Text style={styles.contentText}>Room Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John's Room"
          value={roomName}
          onChangeText={setRoomName}
          autoCorrect={false}
        />
        {/* <Text style={styles.contentText}>Select devices to include.</Text> */}
        {tempList.length === 0 ? (
          <View
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              },
            ]}>
            <Text>No devices are available.</Text>
            <Text> Add more in</Text>
            <MaterialIcons name="add-circle-outline" size={30} color={'#BBB'} />
          </View>
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.contentText}>Select devices to include.</Text>
            <FlatList
              key={numColumns}
              data={tempList}
              renderItem={renderItem}
              numColumns={numColumns}
              keyExtractor={(item, index) => `${item.deviceName}-${index}`}
            />
          </View>
        )}

        <View style={styles.horizontal}>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              // setTempList(
              //   smartplugList.filter(smartplugList => smartplugList.room == 0),
              // );
              setFilteredDevices();
              setIsRoomModalVisible(false);
              setRoomName('');
              setCountSelected(0);
              props.closeModal();
              props.isVisible = false;
              setUpdate(true);
            }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              roomName === '' || countSelected == 0
                ? styles.modalButtonDisabled
                : styles.modalButtonEnabled,
            ]}
            onPress={() => {
              setRoomName('');
              handleAddRoom(roomName, 'sdf');
              setNewRoomList(tempList);
              // setSmartplugList(tempList);
              setCountSelected(0);
              props.closeModal();
              props.isVisible = false;
              setUpdate(true);
            }}
            disabled={roomName === '' || countSelected == 0}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddRoom;
