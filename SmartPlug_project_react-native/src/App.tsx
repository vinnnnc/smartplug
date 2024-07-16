import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/HomeScreen';
import Rooms from './screens/RoomsScreen';
import About from './screens/AboutScreen';
import Rules from './screens/ScheduleScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PlusModal from './components/PlusModal';
import { ContextProvider } from './components/ContextProvider';

const Tab = createBottomTabNavigator();

const AddModalComponent = () => {
  return null;
};

const App = () => {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size, color }) => {
              let iconName: string = '';
              if (route.name === 'Home') {
                iconName = 'home';
                size = focused ? 25 : 20;
              } else if (route.name === 'Rooms') {
                iconName = 'meeting-room';
                size = focused ? 25 : 20;
              } else if (route.name === 'Add') {
                iconName = 'add-circle-outline';
                size = focused ? 25 : 20;
              } else if (route.name === 'Schedule') {
                iconName = 'schedule';
                size = focused ? 25 : 20;
              } else if (route.name === 'About') {
                iconName = 'help-outline';
                size = focused ? 25 : 20;
              }
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            },
            tabBarActiveTintColor: '#555',
            tabBarInactiveTintColor: '#BBB',
            tabBarItemStyle: {
              padding: 5,
            },
          })}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Rooms" component={Rooms} />
          <Tab.Screen
            name="Add"
            component={AddModalComponent}
            options={{
              tabBarButton: () => <PlusModal />,
            }}
          />
          <Tab.Screen name="Schedule" component={Rules} />
          <Tab.Screen name="About" component={About} />
        </Tab.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
