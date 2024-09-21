import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

const TOTAL_TIME = 4 * 60; // 4 minutes en secondes
const ROUND_TIME = 20; // Temps de l'exercice en secondes
const REST_TIME = 10; // Temps de repos en secondes
const PREP_TIME = 5; // Temps de préparation avant le début en secondes
const TOTAL_ROUNDS = 8; // Nombre total de rounds

function TimerTabataScreen() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); // Temps global restant
  const [round, setRound] = useState(1); // Numéro de round
  const [innerTimeLeft, setInnerTimeLeft] = useState(PREP_TIME); // Temps pour le round en cours ou préparation
  const [isExercise, setIsExercise] = useState(false); // Si on est en période d'exercice
  const [isPreparing, setIsPreparing] = useState(true); // Si on est en phase de préparation
  const [running, setRunning] = useState(false); // Si le timer tourne

  useEffect(() => {
    let interval = null;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        if (innerTimeLeft > 0) {
          setInnerTimeLeft((prev) => prev - 1); // Décompte du temps interne
        } else {
          if (isPreparing) {
            // Si on est en phase de préparation, commencer l'exercice
            setIsPreparing(false);
            setInnerTimeLeft(ROUND_TIME);
            setIsExercise(true); // Démarrer l'exercice après préparation
          } else if (round <= TOTAL_ROUNDS) {
            if (isExercise) {
              setInnerTimeLeft(REST_TIME); // Passer au repos
              setIsExercise(false); // Passe au repos
            } else {
              setRound((prevRound) => prevRound + 1); // Changer de round
              setInnerTimeLeft(ROUND_TIME); // Passer à l'exercice suivant
              setIsExercise(true); // Passe à l'exercice
            }
          }
        }
        setTimeLeft((prev) => prev - 1); // Décompte du temps global
      }, 1000); // Décrémenter chaque seconde
    } else if (timeLeft === 0) {
      clearInterval(interval); // Stop le timer quand terminé
    }
    return () => clearInterval(interval); // Nettoie l'intervalle
  }, [running, timeLeft, innerTimeLeft, round, isExercise, isPreparing]);

  const startTimer = () => {
    setRunning((prevRunning) => !prevRunning); // Alterne entre pause et reprise
  };

  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(TOTAL_TIME);
    setRound(1);
    setInnerTimeLeft(PREP_TIME);
    setIsExercise(false);
    setIsPreparing(true); // On recommence avec la préparation
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#451e6a', 'black']}
        style={styles.background}
        />
      {/* Cercle extérieur pour le temps global avec animation */}
      <AnimatedCircularProgress
        size={300}
        width={10}
        fill={((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100}
        tintColor="#FFFFFF"
        backgroundColor="#333"
        strokeCap="round"
        duration={1000} // Durée de l'animation (1 seconde)
      />

      {/* Cercle intérieur pour le round avec animation */}
      <View style={styles.innerCircleContainer}>
        <AnimatedCircularProgress
          size={200}
          width={15}
          fill={((isExercise ? ROUND_TIME : REST_TIME) - innerTimeLeft) / (isExercise ? ROUND_TIME : REST_TIME) * 100}
          tintColor={isExercise ? '#00FF00' : '#FFA500'}
          backgroundColor="#222"
          strokeCap="round"
          duration={1000} // Durée de l'animation (1 seconde)
        />
        <Text style={styles.roundText}>
          {isPreparing ? 'Préparation' : `Round ${round}/${TOTAL_ROUNDS}`}
        </Text>
      </View>

      <Text style={styles.timerText}>{innerTimeLeft}s</Text>

      {/* Boutons Start/Pause/Reset */}
      <Button
        title={running ? 'Pause' : 'Start'}
        onPress={startTimer}
        buttonStyle={styles.startButton}
      />
      <Button
        title="Reset"
        onPress={resetTimer}
        buttonStyle={{
          borderRadius: 15,
          margin: 10,
          width: 350,
          backgroundColor: '#ac53a6',
          borderWidth: 1,
          borderColor: 'white',
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fond noir pour l'effet
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  innerCircleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '25%',
  },
  roundText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    position: 'absolute',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#00FF00',
    textAlign: 'center',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: 'rgba(61, 153, 245, 1)',
    borderRadius: 15,
    marginTop: 30,
    width: 350,
    borderWidth: 1,
    borderColor: 'white',
  },
  resetButton: {
    backgroundColor: '#ac53a6',
    borderRadius: 15,
    marginTop: 10,
    width: 350,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default TimerTabataScreen;
