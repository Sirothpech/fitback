import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/fr';

moment.updateLocale('fr', {
  months: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
});

const API_URL = 'http://192.168.117.86:3000';

function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [exercise, setExercise] = useState('');
  const [meal, setMeal] = useState('');
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const loadUserID = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');
        setUserID(userID);
      } catch (error) {
        console.error("Erreur lors du chargement de l'ID utilisateur :", error);
      }
    };

    loadUserID();
  }, []);

  // Charger les données pour la date sélectionnée
  const loadDataForDate = async (date) => {
    try {
      if (!userID) return;
      const response = await axios.get(`${API_URL}/getActivity`, {
        params: { userID, date }
      });
      setExercise(response.data.exercise);
      setMeal(response.data.meal);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  // Sauvegarder les données pour la date sélectionnée
  const saveDataForDate = async () => {
    try {
      if (!userID) {
        Alert.alert("Erreur", "Utilisateur non connecté");
        return;
      }
      await axios.post(`${API_URL}/saveActivity`, {
        userID,
        date: moment(selectedDate, 'DD MMMM YYYY').format('YYYY-MM-DD'),
        exercise,
        meal
      });
      Alert.alert("Succès", "Données sauvegardées !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données :", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#451e6a', 'black']}
        style={styles.background}
        />
      <Calendar
        onDayPress={(day) => {
          const formattedDate = moment(day.dateString).format('DD MMMM YYYY');
          setSelectedDate(formattedDate);
          loadDataForDate(day.dateString);
        }}
      />

      {selectedDate ? (
        <ScrollView style={styles.formContainer}>
          <Text style={{color: 'white'}}>Ajouter des infos pour le {selectedDate} :</Text>

          <TextInput
            style={styles.input}
            placeholder="Exercices"
            value={exercise}
            onChangeText={setExercise}
            multiline={true}
            textAlignVertical="top"
          />
          <TextInput
            style={styles.input}
            placeholder="Repas"
            value={meal}
            onChangeText={setMeal}
            multiline={true}
            textAlignVertical="top"
          />

          <Button title="Sauvegarder" onPress={saveDataForDate}
          buttonStyle={{
            backgroundColor: 'rgba(61, 153, 245, 1)',
            borderRadius: 15,
            margin: 10,
            borderWidth: 1,
            borderColor: 'white',
          }} />
        </ScrollView>
      ) : (
        <Text style={{color: 'white'}}>Sélectionnez une date pour entrer vos informations.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  formContainer: {
    marginTop: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 100,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default CalendarScreen;
