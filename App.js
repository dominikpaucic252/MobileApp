import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';
console.log(Pedometer);


export default function App() {
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  let _subscription = null;

  useEffect(() => {
    return () => {
      if (_subscription) {
        _subscription.remove();
        _subscription = null;
      }
    };
  }, []);

  const _subscribe = () => {
    _subscription = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
    });
    
    setIsTracking(true);
};

  const _unsubscribe = () => {
    if (_subscription) {
      _subscription.remove();
      _subscription = null;
      setIsTracking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StepAndTrack App</Text>
      <Text style={styles.label}>Schritte:</Text>
      <Text style={styles.value}>{steps}</Text>

      <Button 
        title={isTracking ? "Stop Tracking" : "Starte Tracking"} 
        onPress={() => {
          if (isTracking) {
            _unsubscribe();
          } else {
            _subscribe();
          }
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

