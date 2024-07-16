import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from '../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddDevice from './AddDevice';
import AddRoom from './AddRoom';
import AddTimer from './AddSchedule';
import AddRule from './AddRule';

const AddModal = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addDeviceModalVisible, setAddDeviceModalVisible] = useState(false);
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const [addTimerModalVisible, setAddTimerModalVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [text, onChangeText] = useState('');

  const closeAddDeviceModal = () => {
    setAddDeviceModalVisible(false);
  };

  const closeAddRoomModal = () => {
    setAddRoomModalVisible(false);
  };

  const closeAddNFCModal = () => {
    setAddTimerModalVisible(false);
  };

  return (
    <>
      <TouchableHighlight
        onPress={() => {
          setAddModalVisible(true);
        }}
        style={styles.buttonStyle}>
        <MaterialIcons name="add-circle-outline" size={90} color={'#BBB'} />
      </TouchableHighlight>
      <View>
        <Modal
          backdropOpacity={0.3}
          isVisible={addModalVisible}
          onBackdropPress={() => setAddModalVisible(false)}
          onBackButtonPress={() => setAddModalVisible(false)}
          style={styles.contentView}>
          <View style={styles.addContent}>
            <Text style={styles.contentTitle}>Add</Text>
            <TouchableOpacity
              style={styles.modalSelection}
              onPress={() => {
                setAddModalVisible(false);
                setAddDeviceModalVisible(true);
              }}>
              <View>
                <MaterialIcons name="power" size={30} style={styles.icon} />
                <Text style={styles.text}>Device</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSelection}
              onPress={() => {
                setAddModalVisible(false);
                setAddRoomModalVisible(true);
              }}>
              <View>
                <MaterialIcons
                  name="meeting-room"
                  size={30}
                  style={styles.icon}
                />
                <Text style={styles.text}>Room</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSelection}
              onPress={() => {
                setAddModalVisible(false);
                setAddTimerModalVisible(true);
              }}>
              <View>
                <MaterialIcons name="schedule" size={30} style={styles.icon} />
                <Text style={styles.text}>Schedule</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.modalSelection}
              >
              <View>
                <MaterialIcons name="nfc" size={30} style={styles.icon} />
                <Text style={styles.text}>NFC</Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </Modal>

        <AddDevice
          isVisible={addDeviceModalVisible}
          closeModal={closeAddDeviceModal}
        />
        <AddRoom
          isVisible={addRoomModalVisible}
          closeModal={closeAddRoomModal}
        />
        <AddTimer isVisible={addTimerModalVisible} closeModal={closeAddNFCModal} />
      </View>
    </>
  );
};

export default AddModal;
