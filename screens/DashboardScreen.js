import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const defaultProfileImage = require('../assets/default-profile.jpeg');

function DashboardScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiCategory, setBmiCategory] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const savedUsername = await AsyncStorage.getItem('username');

      if (userID && savedUsername) {
        setUsername(savedUsername);
        const savedAge = await AsyncStorage.getItem(`${userID}_age`);
        const savedGender = await AsyncStorage.getItem(`${userID}_gender`);
        const savedWeight = await AsyncStorage.getItem(`${userID}_weight`);
        const savedHeight = await AsyncStorage.getItem(`${userID}_height`);
        const savedProfileImage = await AsyncStorage.getItem(`${userID}_profileImage`);

        if (savedAge) setAge(savedAge);
        if (savedGender) setGender(savedGender);
        if (savedWeight) setWeight(savedWeight);
        if (savedHeight) setHeight(savedHeight);
        if (savedProfileImage) setProfileImage(savedProfileImage);

        if (savedWeight && savedHeight) {
          calculateBMI(savedWeight, savedHeight);
        }
      } else {
        console.log("Aucun utilisateur trouvé");
      }
    } catch (error) {
      console.log("Erreur lors du chargement des données utilisateur :", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    let category = '';
    if (bmiValue < 18.5) {
      category = 'Insuffisance pondérale (maigreur)';
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      category = 'Poids normal';
    } else if (bmiValue >= 25.0 && bmiValue <= 29.9) {
      category = 'Surpoids';
    } else if (bmiValue >= 30.0 && bmiValue <= 34.9) {
      category = 'Obésité modérée';
    } else if (bmiValue >= 35.0 && bmiValue <= 39.9) {
      category = 'Obésité sévère';
    } else if (bmiValue >= 40.0) {
      category = 'Obésité massive';
    }

    setBmiCategory(category);
  };

  // Fonction pour se déconnecter
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Efface toutes les données stockées
      navigation.replace('Login'); // Redirige vers l'écran de connexion
    } catch (error) {
      console.log("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {capitalizeFirstLetter(username)}</Text>
      <Image
        source={profileImage ? { uri: profileImage } : defaultProfileImage}
        style={styles.profileImage}
      />
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      )}

      {/* Cadre pour les informations */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Âge : {age}</Text>
        <Text style={styles.infoText}>Sexe : {gender}</Text>
        <Text style={styles.infoText}>Poids : {weight} kg</Text>
        <Text style={styles.infoText}>Taille : {height} cm</Text>
        <Text style={styles.infoText}>IMC : {bmi}</Text>
        <Text style={styles.infoText}>Catégorie IMC : {bmiCategory}</Text>
      </View>

      {/* Bouton de déconnexion */}
      <Button 
        title="Déconnexion" 
        onPress={handleLogout}
        buttonStyle={{
          backgroundColor: 'rgba(245, 61, 61, 1)',
          borderRadius: 15,
          marginTop: 20,
          width: 350,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default DashboardScreen;
