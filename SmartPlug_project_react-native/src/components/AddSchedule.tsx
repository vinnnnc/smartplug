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
  Switch,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from '../styles/styles';
import { Context, room, smartplug } from './ContextProvider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { height } = Dimensions.get('window');
import DatePicker from 'react-native-date-picker'

type AddRoomProps = {
  closeModal(): any;
  isVisible: boolean;
};

const AddTimer = (props: AddRoomProps) => {
  const { smartplugList, setSmartplugList } = useContext(Context);
  const { roomList, setRoomList } = useContext(Context);
  const { scheduleList, setScheduleList } = useContext(Context);
  const { update, setUpdate } = useContext(Context);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [tempList, setTempList] = useState<smartplug[]>([]);
  const [newSchedIndex, setNewSchedIndex] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dateOn, setDateOn] = useState(new Date())
  const [dateOff, setDateOff] = useState(new Date())
  const [isNotifEnabled, setIsNotifEnabled] = useState(false);
  const [isPowerOnEnabled, setIsPowerOnEnabled] = useState(true);
  const [isPowerOffEnabled, setIsPowerOffEnabled] = useState(false);
  const [roomOrDevices, setRoomOrDevices] = useState(false);
  const [isDevicesSelected, setIsDevicesSelected] = useState(false);

  const toggleNotif = () => setIsNotifEnabled(previousState => !previousState);
  const togglePowerOn = () => setIsPowerOnEnabled(previousState => !previousState);
  const togglePowerOff = () => setIsPowerOffEnabled(previousState => !previousState);

  const handleToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const minCols = 2;

  const delay = (ms: number) =>
    new Promise((resolve: any) => setTimeout(resolve, ms));

  // const handleAddRoom = async (roomName: string, roomInfo: string) => {
  //   const newRoomList = [
  //     ...roomList,
  //     {
  //       roomName: roomName,
  //       deviceCount: countSelected,
  //       enabled: false,
  //       nfc: 0,
  //       timer: 0,
  //     },
  //   ];
  //   setRoomList(newRoomList);
  //   console.log('room added');
  // };

  const handleAddSchedule = async (device: string, repeat: string[], pon: Date, poff: Date, notif: boolean) => {
    const newScheduleList = [
      ...scheduleList,
      {
        device: device,
        repeat: repeat,
        sTime: pon,
        eTime: poff,
        notif: notif,
      },
    ];
    setScheduleList(newScheduleList);
    console.log('room added');
  };

  const handleSetSchedule = async (smartplugIndex: number) => {
    const newList = [...tempList];
    // if (newList[smartplugIndex].schedule == -1) {
    //   newList[smartplugIndex].schedule = 0;

    // } else {
    newList[smartplugIndex].schedule = 0;
    setSelectedDevice(newList[smartplugIndex].deviceName);
    newList.forEach((item, index) => {
      if (index != smartplugIndex) {
        newList[index].schedule = -1
      }
    })

    // }
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

  const renderDevices = ({ item, index }: { item: smartplug; index: number }) => (
    <Pressable
      style={[
        styles.item,
        styles.online,
        item.schedule == -1 ? null : { backgroundColor: '#2196F3' },
      ]}
      onPress={() => {
        handleSetSchedule(index);
      }}>
      <View style={styles.itemDetails}>
        <MaterialIcons
          name="lightbulb-outline"
          size={50}
          color={item.schedule == -1 ? '#BBB' : '#50CCF3'}
          style={[
            styles.icon,
            item.schedule == -1 ? null : { backgroundColor: '#30AAF3' },
          ]}
        />
        <Text style={styles.title}>{item.deviceName}</Text>
      </View>
    </Pressable>
  );

  const renderRooms = ({ item, index }: { item: room; index: number }) => (
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
    </Pressable>
  );

  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(calcNumColumns(width));

  useEffect(() => {
    setNumColumns(calcNumColumns(width));
  }, [{ width }]);

  const setFilteredDevices = () => {
    const newTempList = [...smartplugList];
    setTempList(newTempList.filter(newTempList => newTempList.schedule == -1));
  };

  const setNewSchedList = (item: smartplug[]) => {
    const newTempList = [...smartplugList];
    newTempList.forEach((oldItem, oldIndex) => {
      item.forEach((newItem, newIndex) => {
        if (oldItem.ipAddress == newItem.ipAddress) {
          newTempList[oldIndex].schedule = item[newIndex].schedule;
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
          smartplugList.filter(smartplugList => smartplugList.schedule == -1),
        );
        setIsDevicesSelected(false);
        setFilteredDevices();
        setUpdate(false);
        setNewSchedIndex(scheduleList.length);
      }}
      onDismiss={() => setUpdate(true)}
      presentationStyle={'overFullScreen'}
      isVisible={props.isVisible}
      style={{
        margin: 0,
        padding: 10,
        backgroundColor: 'white'
      }}>
      {isDevicesSelected && (<View style={[styles.listContainer]}>
        <Text style={styles.contentTitle}>Add Schedule</Text>
        <Text style={styles.contentTitle}>Repeat</Text>
        <View style={styles.dayPicker}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayToggle,
                selectedDays.includes(day) && styles.selectedToggleButton,
              ]}
              onPress={() => handleToggle(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDays.includes(day) && styles.selectedDayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{
          justifyContent: 'center',
          margin: 10
        }}>

          <View style={[{ flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderTopWidth: .5 }]}>
            <Text style={styles.contentTitle}>Power On time</Text>
            <Switch
              onValueChange={togglePowerOn}
              value={isPowerOnEnabled}
              style={{ flex: 1 }}
            />
          </View>
          {isPowerOnEnabled && (
            <DatePicker
              date={dateOn}
              onDateChange={setDateOn}
              mode='time'
              androidVariant="nativeAndroid"
              style={{ alignSelf: "center" }}
            />)}
          <View style={[{ flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderTopWidth: .5 }]}>
            <Text style={styles.contentTitle}>Power Off time</Text>
            <Switch
              onValueChange={togglePowerOff}
              value={isPowerOffEnabled}
              style={{ flex: 1 }}
            />
          </View>
          {isPowerOffEnabled && (
            <DatePicker
              date={dateOff}
              onDateChange={setDateOff}
              mode='time'
              androidVariant="nativeAndroid"
              style={{ alignSelf: "center" }}
            />)}

          <View style={[{ flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderTopWidth: .5 }]}>
            <Text style={[styles.contentTitle]}>Notification</Text>
            <Switch
              onValueChange={toggleNotif}
              value={isNotifEnabled}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>)}
      {
        !isDevicesSelected && <>
          <View style={styles.horizontal}>
            <TouchableOpacity
              onPress={() => {
                setRoomOrDevices(false)
              }}>
              <Text style={[roomOrDevices ? { fontSize: 30 } : { fontSize: 40 }]}>Devices</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 40, margin: 20 }}>/</Text>
            <TouchableOpacity
              onPress={() => {
                setRoomOrDevices(true)
              }}>
              <Text style={[!roomOrDevices ? { fontSize: 30 } : { fontSize: 40 }]}>Rooms</Text>
            </TouchableOpacity>
          </View>
          {!roomOrDevices ? (<View style={styles.listContainer}>
            <Text style={styles.contentText}>Select a device to include.</Text>
            <FlatList
              key={numColumns}
              data={smartplugList}
              renderItem={renderDevices}
              numColumns={numColumns}
              keyExtractor={(item, index) => `${item.deviceName}-${index}`}
            />
          </View>) : (<View style={styles.listContainer}>
            <Text style={styles.contentText}>Select a room to include.</Text>
            <FlatList
              key={numColumns}
              data={roomList}
              renderItem={renderRooms}
              numColumns={numColumns}
              keyExtractor={(item, index) => `${item.roomName}-${index}`}
            />
          </View>)}
        </>
      }
      <View style={[styles.horizontal, { bottom: 0 }]}>
        <TouchableOpacity
          style={[styles.modalButton]}
          onPress={() => {
            setFilteredDevices();
            setIsRoomModalVisible(false);
            setSelectedDevice('');
            props.closeModal();
            props.isVisible = false;
            setUpdate(true);
          }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalButton,
            selectedDevice == ''
              ? styles.modalButtonDisabled
              : styles.modalButtonEnabled,
          ]}
          onPress={() => {
            if (!isDevicesSelected) {
              setIsDevicesSelected(true);
            } else {

              handleAddSchedule(selectedDevice, selectedDays, dateOn, dateOff, true);
              // setNewSchedList(tempList);
              // setSmartplugList(tempList);
              setSelectedDevice('');
              props.closeModal();
              props.isVisible = false;
              setUpdate(true);
            }
          }}
          disabled={selectedDevice == ''}
        >
          {isDevicesSelected ? (<Text>Save</Text>) : (<Text >Next</Text>)}
        </TouchableOpacity>
      </View>
    </Modal >
  );
};

export default AddTimer;
