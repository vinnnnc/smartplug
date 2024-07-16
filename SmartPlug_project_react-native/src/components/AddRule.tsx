import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  useWindowDimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from '../styles/styles';
import { Context, smartplug } from './ContextProvider';

type AddRuleProps = {
  closeModal(): any;
  isVisible: boolean;
};

const AddRule = (props: AddRuleProps) => {
  const { smartplugList, setSmartplugList } = useContext(Context);
  const { update, setUpdate } = useContext(Context);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  return (
    <Modal
      backdropOpacity={0}
      presentationStyle={'overFullScreen'}
      isVisible={true}
      style={{ margin: 0, padding: 10, backgroundColor: 'white' }}>
      <View style={styles.listContainer}>
        <Text style={styles.contentTitle}>Add Room</Text>
        <Text style={styles.contentText}>Room Name</Text>
        <TextInput style={styles.input} placeholder="e.g. John's Room" />
        <Text style={styles.contentText}>Select devices to include.</Text>
        <View style={styles.horizontal}>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              setIsRoomModalVisible(false);
              props.closeModal();
              props.isVisible = false;
            }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton]}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddRule;
