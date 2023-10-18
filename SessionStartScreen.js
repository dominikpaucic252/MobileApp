// SessionStartScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SessionStartScreen({ navigation }) {
  const [sessionName, setSessionName] = useState('');

  const onStartTracking = async () => {
    try {
      // Sessionnamen in AsyncStorage speichern
      await AsyncStorage.setItem('@session_name', sessionName);
      navigation.navigate('Tracking', { sessionName });
    } catch (error) {
      console.error("Fehler beim Speichern des Sessionnamens:", error);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.listText}>Willkommen zur Tracker App!</Text>
        <Text style={styles.descriptionText}>Mit dieser App können Sie:</Text>
        <Text style={styles.descriptionText}>- Ihre Schritte zählen und verfolgen</Text>
        <Text style={styles.descriptionText}>- Ihren aktuellen Standort auf der Karte anzeigen lassen und Ihre Bewegung in Echtzeit verfolgen</Text>
        <Text style={styles.descriptionText}>- Die verstrichene Zeit und die zurückgelegte Entfernung in Metern sehen</Text>
        <Text style={styles.descriptionText}>Um zu beginnen, erstellen Sie bitte eine neue Session, indem Sie einen Session-Namen eingeben und auf "Start" klicken. Viel Spaß beim Tracking!</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Geben Sie den Namen der Session ein"
        placeholderTextColor='gray'
        value={sessionName}
        onChangeText={setSessionName}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={onStartTracking}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#121212',  // Dunkler Hintergrund
      paddingTop: 50
    },
    descriptionText: {
        fontSize: 16,
        color: 'white', // Weisser Text für dunklen Modus
        textAlign: 'center',
        marginBottom: 10, // Einen Abstand zum nächsten Element hinzufügen
      },   
      listText: {
        fontSize: 25,
        color: 'white', // Weisser Text für dunklen Modus
        textAlign: 'center',
        marginBottom: 40, // Einen Abstand zum nächsten Element hinzufügen
        marginTop: -210
      },    
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      borderRadius: 10,  // Runde Ecken für das Eingabefeld
      color: 'white',  // Weisser Text für dunklen Modus
      backgroundColor: '#1E1E1E', // Etwas hellerer Hintergrund als der Container für den Kontrast
      marginTop: 20
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    startButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
  