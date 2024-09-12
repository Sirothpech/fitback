import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/themed';
import * as Font from 'expo-font'; // Importer expo-font pour charger la police

function TimerScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(30); // Temps affiché et restant
  const [running, setRunning] = useState(false); // Indique si le timer est en cours
  const [selectedTime, setSelectedTime] = useState(30); // Temps sélectionné dans le Picker
  const [paused, setPaused] = useState(false); // Statut de pause
  const [fontsLoaded, setFontsLoaded] = useState(false); // Statut de chargement des polices
  const [showInfo, setShowInfo] = useState(false);

  // Charger la police au montage du composant
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'digital': require('../assets/fonts/ds-digital.ttf'), // Chemin vers la police téléchargée
      });
      setFontsLoaded(true); // Police chargée
    }

    loadFonts();
  }, []);

  useEffect(() => {
    let interval = null;
    if (running && !paused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Décrémenter chaque seconde
    } else if (timeLeft === 0) {
      clearInterval(interval);
      alert('Temps écoulé !');
      setRunning(false); // Arrête le timer
    }
    return () => clearInterval(interval); // Nettoie l'intervalle
  }, [running, paused, timeLeft]);

  const handleStartPause = () => {
    if (running) {
      setPaused(!paused); // Basculer entre pause et reprise
    } else {
      setTimeLeft(selectedTime); // Démarre le chronomètre avec le temps sélectionné
      setRunning(true);
      setPaused(false); // Assure que ce n'est pas en pause lors du démarrage
    }
  };

  // Fonction pour formater le temps en mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Formater en mm:ss
  };

  // Mettre à jour l'affichage du temps dès qu'un temps est sélectionné dans le Picker
  const handleTimeChange = (itemValue) => {
    setSelectedTime(itemValue); // Mettre à jour le temps sélectionné
    setTimeLeft(itemValue); // Mettre à jour l'affichage du temps
  };

  if (!fontsLoaded) {
    return <Text>Chargement de la police...</Text>; // Affiche un message pendant le chargement des polices
  }

  return (
    <View style={styles.container}>
      {/* Afficher le temps sélectionné ou restant */}
      <View style={styles.timerContainer}>
        <Text style={styles.time}>{formatTime(timeLeft)}</Text>
      </View>

      <Picker
        selectedValue={selectedTime}
        onValueChange={handleTimeChange} // Mettre à jour l'affichage dès qu'un temps est sélectionné
        style={styles.picker}
      >
        <Picker.Item label="30 sec" value={30} />
        <Picker.Item label="1 min" value={60} />
        <Picker.Item label="2 min" value={120} />
        <Picker.Item label="3 min" value={180} />
      </Picker>

      <Button
        title={running && !paused ? 'Pause' : running ? 'Resume' : 'Start'}
        onPress={handleStartPause}
        buttonStyle={{
          backgroundColor: 'rgba(61, 153, 245, 1)',
          borderRadius: 15,
          margin: 10,
          width: 350,
        }}
      />
      <Button
        title="Reset"
        onPress={() => { setTimeLeft(selectedTime); setRunning(false); setPaused(false); }}
        buttonStyle={{
          backgroundColor: 'rgba(245, 176, 61, 1)',
          borderRadius: 15,
          margin: 10,
          width: 350,
        }}
      />
      <Button
    title="Chronomètre"
    onPress={() => navigation.navigate('Chronometer')} // Navigue vers le chronomètre
    buttonStyle={{
        backgroundColor: 'rgba(61, 153, 245, 1)',
        borderRadius: 15,
        margin: 10,
        width: 350,
    }}
    />
    <Button
    title="Timer Tabata"
    onPress={() => navigation.navigate('TimerTabata')} // Navigue vers le chronomètre
    buttonStyle={{
        backgroundColor: 'rgba(61, 153, 245, 1)',
        borderRadius: 15,
        margin: 10,
        width: 350,
    }}
    />
    <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
        <Text style={styles.infoButton}>Infos</Text>
      </TouchableOpacity>

      {showInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Le timer tabata dure 4 minutes et est composé de 8 séries de 20 secondes d'effort et de 10 secondes de repos.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Couleur de fond noire pour l'effet digital
  },
  timerContainer: {
    backgroundColor: '#111', // Arrière-plan foncé pour l'écran digital
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00ff00', // Couleur verte pour l'effet d'écran digital
  },
  time: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#00ff00', // Couleur verte pour l'affichage du temps (effet digital)
    textShadowColor: 'rgba(0, 255, 0, 0.75)', // Effet lumineux autour du texte
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    fontFamily: 'digital', // Utilisation de la police personnalisée chargée
  },
  picker: {
    height: 50,
    width: 150,
    color: '#fff', // Couleur du texte dans le picker
    backgroundColor: '#222', // Fond sombre pour le picker
    marginBottom: 20,
  },
  infoButton: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    margin: 10,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default TimerScreen;
