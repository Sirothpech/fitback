import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

function ChronometerScreen() {
  const [time, setTime] = useState(0); // Temps écoulé en secondes
  const [running, setRunning] = useState(false); // Indique si le chrono est en cours ou non

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000); // Incrémente chaque seconde
    } else if (!running && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Nettoie l'intervalle
  }, [running, time]);

  const formatTime = (timeInSeconds) => {
    const getSeconds = `0${timeInSeconds % 60}`.slice(-2);
    const minutes = `${Math.floor(timeInSeconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    return `${getMinutes} : ${getSeconds}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#451e6a', 'black']}
        style={styles.background}
        />
      <View style={styles.timerContainer}>
        <Text style={styles.time}>{formatTime(time)}</Text>
      </View>

      <Button 
        title={running ? 'Pause' : 'Start'} 
        onPress={() => setRunning(!running)} 
        buttonStyle={styles.startPauseButton} 
        ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ["rgba(61, 153, 245, 1)", "rgba(61, 100, 245, 1)"],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
      ></Button>
      <Button 
        title="Reset" 
        onPress={() => { setTime(0); setRunning(false); }} 
        buttonStyle={styles.resetButton} 
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fond noir pour l'effet digital
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  timerContainer: {
    backgroundColor: '#111', // Arrière-plan foncé pour l'écran digital
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ac53a6', // Couleur verte pour l'effet digital
  },
  time: {
    fontSize: 60,
    color: '#ac53a6', // Couleur verte pour l'effet digital
    textShadowColor: 'rgba(255, 0, 255, 0.75)', // Effet lumineux autour du texte
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    fontFamily: 'digital', // Utilisation de la police personn
  },
  startPauseButton: {
    backgroundColor: 'rgba(61, 153, 245, 1)',
    borderRadius: 15,
    margin: 10,
    width: 350,
    borderWidth: 1,
    borderColor: 'white',
  },
  resetButton: {
    backgroundColor: '#ac53a6',
    borderRadius: 15,
    margin: 10,
    width: 350,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default ChronometerScreen;
