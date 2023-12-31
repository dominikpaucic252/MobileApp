import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

export default function TrackingScreen() {
    const [steps, setSteps] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const locationRef = useRef(null);
    const prevLocationRef = useRef(null);
    const [distance, setDistance] = useState(0);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [route, setRoute] = useState([]);
    const [hasFinished, setHasFinished] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);
    const [finalSteps, setFinalSteps] = useState(0);  // Neue Zustände hinzugefügt
    const [finalDistance, setFinalDistance] = useState(0);
    let _subscription = null;
    const _endProgram = () => {
      if (isTracking) {
        _unsubscribe(); // Wenn Sie Tracking stoppen möchten, wenn "Beenden" gedrückt wird
      }
      setHasFinished(true);
    };

    let locationSubscription = null;
    let pedometerSubscription = null
  
    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371e3; 
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
  
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      return R * c; 
    }
  
    useEffect(() => {
      return () => {
        _unsubscribe(); 
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, []);
    
    const startTimer = () => {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    };
  
    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  
    const _subscribe = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Berechtigung zum Zugriff auf den Standort wurde abgelehnt');
        return;
      }
  
      Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 10000,
        distanceInterval: 10,
      }, (newLocation) => {
        console.log("Neuer Standort empfangen:", newLocation);
      
        setCurrentLocation(newLocation.coords);
        setRoute(prevRoute => [...prevRoute, newLocation.coords]);
      
        if (!locationRef.current) {
          console.log("Erster Standort erhalten. Setze locationRef.current.");
          locationRef.current = newLocation;
          return; // Da dies der erste Standort ist, gibt es keinen vorherigen Standort, mit dem wir die Entfernung berechnen können.
        }
      
        if (locationRef.current) { 
          const { latitude: prevLat, longitude: prevLong } = locationRef.current.coords;
          const { latitude: newLat, longitude: newLong } = newLocation.coords;
      
          let newDistance = haversine(prevLat, prevLong, newLat, newLong);
          console.log(`Berechnete Entfernung zwischen vorherigem Standort und aktuellem Standort: ${newDistance} Meter.`);
          setDistance(prevDistance => prevDistance + newDistance);
        }
      
        prevLocationRef.current = locationRef.current;
        locationRef.current = newLocation;
      });     
  
      _subscription = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
      });
  
      setIsTracking(true);
      startTimer();
    };

    const _endTracking = () => {
      setFinalSteps(steps);   // Aktuelle Schritte im finalen Zustand speichern
      setFinalDistance(distance);  // Aktuelle Distanz im finalen Zustand speichern
      
      if (_subscription) {
        _subscription.remove();
        _subscription = null;
      }
      setIsTracking(false);
      setHasEnded(true);
      stopTimer();
    };
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>StepandTrack</Text>
        </View>
    
        <MapView
          style={[styles.map, { marginTop: 50, marginHorizontal: 0 }]}
          initialRegion={currentLocation ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } : undefined}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Polyline coordinates={route} strokeWidth={3} />
        </MapView>
    
        <View style={[styles.dataContainer, { marginVertical: 30 }]}>
          {/* Schritte und Distanz entsprechend dem Tracking-Zustand anzeigen */}
          <Text style={styles.dataText}>{hasEnded ? finalSteps : steps} Schritte</Text>
          <Text style={styles.dataText}>{elapsedTime} Sek.</Text>
          <Text style={styles.dataText}>{hasEnded ? finalDistance.toFixed(2) : distance.toFixed(2)} Meter</Text>
        </View>
    
        <View style={styles.buttonContainer}>
          {!isTracking && !hasEnded && (
            <TouchableOpacity 
              style={styles.roundButton}
              onPress={_subscribe}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          {isTracking && (
            <TouchableOpacity 
              style={[styles.roundButton]}
              onPress={_endTracking} 
            >
              <Text style={styles.buttonText}>Beenden</Text>
            </TouchableOpacity>
          )}
          {hasEnded && (
            <Text style={{ color: 'white', fontSize: 16, marginTop: 20 }}>
              Bitte starten Sie eine neue Session.
            </Text>
          )}
        </View>
      </View>
    );    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',  // Dunkler Hintergrund
    },
    header: {
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
    },
    headerText: {
      fontSize: 24,
      color: 'white',
      fontWeight: 'bold',
      marginTop: 10,
    },
    map: {
      height: '45%',  // Karte ein vergrössern
      borderRadius: 10,
    },
    dataContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
    },
    dataText: {
      fontSize: 16,
      color: 'white',  // Weisser Text für dunklen Modus
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    roundButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    endButton: {
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
