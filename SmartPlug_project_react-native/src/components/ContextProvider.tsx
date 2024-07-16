import React, { createContext, useState } from 'react';

export interface smartplug {
  deviceName: string;
  ipAddress: string;
  enabled: boolean;
  online: boolean;
  room: number;
  nfc: number;
  schedule: number;
}

export interface room {
  roomName: string;
  deviceCount: number;
  enabled: boolean;
  nfc: number;
  timer: number;
}

export interface schedule {
  device: string;
  repeat: string[];
  sTime: Date;
  eTime: Date;
  notif: boolean;
}

type ContextType = {
  ipAddress: string;
  setIpAddress: (newIpaddress: string) => void;
  name: string;
  setName: (newName: string) => void;
  update: boolean;
  setUpdate: (newUpdate: boolean) => void;
  smartplugList: smartplug[];
  setSmartplugList: (newList: smartplug[]) => void;
  roomList: room[];
  setRoomList: (newList: room[]) => void;
  scheduleList: schedule[];
  setScheduleList: (newList: schedule[]) => void;
};

export const Context = createContext<ContextType>({
  ipAddress: '',
  setIpAddress: () => { },
  name: '',
  setName: () => { },
  update: false,
  setUpdate: () => { },
  smartplugList: [],
  setSmartplugList: () => { },
  roomList: [],
  setRoomList: () => { },
  scheduleList: [],
  setScheduleList: () => { },
});

type ContextProviderProps = {
  children: React.ReactNode;
};

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [ipAddress, setIpAddress] = useState('');
  const [name, setName] = useState('');
  const [update, setUpdate] = useState(true);
  const [smartplugList, setSmartplugList] = useState<smartplug[]>([
    // {
    //   deviceName: 'Device 1',
    //   ipAddress: '192.168.1.164',
    //   enabled: true,
    //   online: true,
    //   room: 0,
    //   nfc: -1,
    //   schedule: -1,
    // },
    // {
    //   deviceName: 'Device 2',
    //   ipAddress: '192.168.1.174',
    //   enabled: true,
    //   online: true,
    //   room: 0,
    //   nfc: -1,
    //   schedule: -1,
    // },
    // {
    //   deviceName: 'Device 3',
    //   ipAddress: '192.168.1.180',
    //   enabled: true,
    //   online: true,
    //   room: -1,
    //   nfc: -1,
    //   schedule: -1,
    // },
  ]);
  const [roomList, setRoomList] = useState<room[]>([
    // {
    //   roomName: 'My Room',
    //   deviceCount: 2,
    //   enabled: true,
    //   nfc: 0,
    //   timer: 0,
    // }
  ]);
  const [nfcList, setNfcList] = useState<schedule[]>([
    // {
    //   device: "My Room",
    //   repeat: (['Mon', 'Tue']),
    //   sTime: new Date("2016-01-04 10:34:23"),
    //   eTime: new Date("2018-04-05 13:23:33"),
    //   notif: true,
    // },
  ]);

  return (
    <Context.Provider
      value={{
        ipAddress: ipAddress,
        setIpAddress: setIpAddress,
        name: name,
        setName: setName,
        update: update,
        setUpdate: setUpdate,
        smartplugList: smartplugList,
        setSmartplugList: setSmartplugList,
        roomList: roomList,
        setRoomList: setRoomList,
        scheduleList: nfcList,
        setScheduleList: setNfcList,
      }}>
      {children}
    </Context.Provider>
  );
};
