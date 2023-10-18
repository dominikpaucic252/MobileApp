import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';  // Ihr Haupt-Tracking-Bildschirm
import SessionStartScreen from './SessionStartScreen';  // Der neu hinzugefügte Eingabebildschirm

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SessionStart">
        <Stack.Screen name="SessionStart" component={SessionStartScreen} options={{ title: 'Neue Session' }} />
        <Stack.Screen name="Tracking" component={App} options={{ title: 'Tracking' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
