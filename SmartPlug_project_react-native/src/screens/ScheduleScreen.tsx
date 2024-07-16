import {
  Alert,
  FlatList,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import styles from '../styles/styles';
import React, { useContext, useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context, room, schedule } from '../components/ContextProvider';


const Rules = () => {
  const { scheduleList, setScheduleList } = useContext(Context);
  const { smartplugList, setSmartplugList } = useContext(Context);

  const renderItem = ({ item, index }: { item: schedule, index: number }) => (
    <Pressable
      onLongPress={() => Alert.alert('Under development.')}
      style={[styles.item]}>
      <View style={[styles.horizontal, { alignSelf: 'flex-start' }]}>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', borderBottomWidth: .2, paddingBottom: 2 }}>
            {item.device}
          </Text>
          <View style={[styles.horizontal, { margin: 0 }]}>
            <Text style={{ fontSize: 13, marginRight: 50 }}>
              Power On
            </Text>
            <Text style={{ fontSize: 13 }}>
              Power Off
            </Text>
          </View>
          <View style={[styles.horizontal, { margin: 0 }]}>
            <Text style={{ fontSize: 35, marginRight: 30 }}>
              {item.sTime.getHours() > 9 ? item.sTime.getHours() : '0' + item.sTime.getHours()}:{item.sTime.getMinutes() > 9 ? item.sTime.getMinutes() : '0' + item.sTime.getMinutes()}
            </Text>
            <Text style={{ fontSize: 35 }}>
              {item.eTime.getHours() > 9 ? item.eTime.getHours() : '0' + item.eTime.getHours()}:{item.eTime.getMinutes() > 9 ? item.eTime.getMinutes() : '0' + item.eTime.getMinutes()}
            </Text>
          </View>
          <Text style={{ fontSize: 10, marginBottom: 5, borderBottomWidth: .2, paddingBottom: 2 }}>
            Repeat:
          </Text>
          {/* <Text style={{ fontSize: 20 }}>
            {item.repeat.slice(0, item.repeat.length - 1) + ', ' + item.repeat[item.repeat.length - 1]}
          </Text> */}
          <View style={styles.dayPicker}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <View style={[styles.dayToggle, scheduleList[index].repeat.includes(day) && styles.selectedToggleButton,]}>
                <Text style={[styles.dayText]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Switch />
        </View>
      </View>
    </Pressable>
  );

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds


  }, []);

  return (
    <View style={styles.listContainer}>
      {scheduleList.length === 0 ? (
        <View
          style={[
            styles.container,
            {
              flexDirection: 'row',
            },
          ]}>
          <Text>Press </Text>
          <MaterialIcons name="add-circle-outline" size={30} color={'#BBB'} />
          <Text> to add a Schedule.</Text>
        </View>
      ) : (
        <FlatList
          data={scheduleList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.sTime}-${index}`}
        />
      )}
    </View>
  );
};

export default Rules;
