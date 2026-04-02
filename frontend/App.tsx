import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import SignupScreen from './src/screens/SignupScreen';
import GenderScreen from './src/screens/GenderScreen';
import DashboardScreen from './src/screens/DashboardScreen'
import JournalScreen from './src/screens/JournalScreen';
import DailyCheckinScreen from './src/screens/DailyCheckinScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RelaxScreen from './src/screens/RelaxScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Relax" component={RelaxScreen} />
        <Stack.Screen name="DailyCheckin" component={DailyCheckinScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
