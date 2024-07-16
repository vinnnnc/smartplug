import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Wifi from 'react-native-wifi-reborn';
import styles from '../styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from './ContextProvider';

interface Device {
  ssid: string;
  level: number;
}

type AddDeviceProps = {
  closeModal(): any;
  isVisible: boolean;
};

const SearchWifi = (props: AddDeviceProps) => {
  const { ipAddress, setIpAddress } = useContext(Context);
  const [sendingParams, setIsSendingParams] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isWifiParamsSent, setIsWifiParamsSent] = useState(false);
  const [deviceConnected, setIsDeviceConnected] = useState(false);
  const [connectedDeviceIp, setConnectedDeviceIp] = useState('192.168.1.164');
  const [addDeviceModalVisible, setAddDeviceModalVisible] = useState(false);
  const { update, setUpdate } = useContext(Context);
  const { smartplugList, setSmartplugList } = useContext(Context);
  const [name, setName] = useState('New Device');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve: any) => setTimeout(resolve, ms));

  const handleAddDevice = async (ipaddress: string, name: string) => {
    if (ipaddress) {
      const newSmartplugList = [
        ...smartplugList,
        {
          id: 0,
          deviceName: name,
          ipAddress: ipaddress,
          enabled: false,
          online: true,
          room: -1,
          nfc: -1,
          schedule: -1,
        },
      ];
      setSmartplugList(newSmartplugList);
      console.log('device added');
      setUpdate(true);
    } else {
      console.log('ipaddress is empty');
    }
    setAddDeviceModalVisible(false);
    await delay(1000);
    setUpdate(true);
  };

  async function isEspDetected(): Promise<boolean> {
    try {
      console.log('searching for esp');
      // await Wifi.reScanAndLoadWifiList();
      let espWifiDetected = false;
      while (!espWifiDetected && props.isVisible) {
        const wifiList = await Wifi.reScanAndLoadWifiList();
        for (const wifi of wifiList) {
          if (wifi.SSID === 'ESP-01') {
            console.log(
              `ESP-01 WiFi detected with signal strength ${wifi.level}`,
            );
            espWifiDetected = true;
            console.log('Stopped searching.');
            return espWifiDetected;
          }
        }
        await new Promise((resolve: any) => setTimeout(resolve, 3000));
      }
      console.log('Stopped searching.');
      return espWifiDetected;
    } catch (error) {
      console.error('Error scanning for Wi-Fi networks:', error);
      return false;
    }
  }

  const handleSearchDevices = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setIsLoading(true);
      setButtonDisabled(true);
      // setModalVisible(true);
      setIsDeviceConnected(false);
      const esp = await isEspDetected();
      if (esp) {
        try {
          console.log('ESP found! Connecting...');

          const result = await Wifi.connectToProtectedSSID(
            'ESP-01',
            'smartplug',
            false,
          );
          setButtonDisabled(false);
          setIsDeviceConnected(true);
          setUpdate(false);
          setIsLoading(false);
          console.log(result);
        } catch (error) {
          console.log(error);
        }
      }

      // }

      // setIsLoading(false);

      //   await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
      // Wait for 3 seconds before searching again
    } else {
      // Permission denied
    }
  };

  const handleSendWifiParams = async () => {
    try {
      const response = await fetch('http://192.168.4.1/wifi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `ssid=${wifiSsid}&password=${wifiPassword}`,
      });
      if (!response.ok) {
        throw new Error('Failed to send WiFi parameters: 1');
      }

      // Wait for response with new IP address
      const ipResponse = await fetch('http://192.168.4.1/ipaddress', {
        method: 'GET',
      });
      if (!ipResponse.ok) {
        throw new Error('Failed to get IP address');
      }
      const newIp = await ipResponse.text();

      setConnectedDeviceIp(newIp);
      setIsWifiParamsSent(true);

      setIsSendingParams(false);
      setIpAddress(newIp);
      console.log(
        'WiFi parameters sent successfully',
        `New IP address: ${connectedDeviceIp}`,
      );
      // props.closeModal();
      await delay(2000);
      setIsWifiParamsSent(false);
      setAddDeviceModalVisible(true);
      setButtonDisabled(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to send WiFi parameters: 2');
    }
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      onShow={() => {
        setIsLoading(false);
        handleSearchDevices();
      }}
      backdropOpacity={0.3}
      isVisible={props.isVisible}
      style={styles.contentView}>
      <View style={styles.addContent}>
        <Text style={styles.contentTitle}>
          {addDeviceModalVisible ? 'Customize Device' : 'Add a Device'}
        </Text>
        <View>
          {isLoading && (
            <View>
              <Text style={styles.contentText}>
                Turn on your smartplug and hold the power button for 5 seconds.
              </Text>
              <ActivityIndicator size={50} />
              <Text style={styles.contentText}>Waiting for device...</Text>
            </View>
          )}
          {deviceConnected && (
            <View>
              <Text style={styles.contentText}>
                Enter your main router's Wi-Fi credentials.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="SSID"
                value={wifiSsid}
                onChangeText={setWifiSsid}
                autoCorrect={false}
              />
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Password"
                value={wifiPassword}
                autoCorrect={false}
                onChangeText={setWifiPassword}
              />
            </View>
          )}
          {sendingParams && (
            <View>
              <Text style={styles.contentText}>Wait a moment...</Text>
              <ActivityIndicator size={50} />
              <Text style={styles.contentText}>
                Connecting smartplug to Wi-Fi...
              </Text>
            </View>
          )}
          {isWifiParamsSent && (
            <View>
              <Text style={styles.contentText}>
                Wi-fi credentials sent successfully!
              </Text>
              <MaterialIcons name="check" size={40} style={styles.icon} />
              <Text style={styles.contentText}>Connected</Text>
            </View>
          )}
          {addDeviceModalVisible && (
            <View style={styles.addContent}>
              <MaterialIcons
                name="power"
                size={70}
                style={styles.icon}></MaterialIcons>
              <TextInput
                style={styles.input}
                value={name}
                placeholder="e.g. Electric Fan"
                onChangeText={setName}
                autoCorrect={true}
              />
            </View>
          )}
        </View>

        <View style={styles.horizontal}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setAddDeviceModalVisible(false);
              setIsLoading(false);
              setUpdate(true);
              props.closeModal();
              props.isVisible = false;
            }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              buttonDisabled ? styles.modalButtonDisabled : null,
            ]}
            onPress={() => {
              if (addDeviceModalVisible) {
                handleAddDevice(ipAddress, name);
                setName('New Device');
                setIpAddress('');
                props.closeModal();
                props.isVisible = false;
              } else if (deviceConnected) {
                handleSendWifiParams();
                setIsSendingParams(true);
                setButtonDisabled(true);
                setIsDeviceConnected(false);
              }
            }}
            disabled={buttonDisabled}>
            <Text>{addDeviceModalVisible ? 'Add' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SearchWifi;
