import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const defaultProfileImage = require('../assets/default-profile.jpeg');

function DashboardScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
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
      const savedUsername = await AsyncStorage.getItem('identifier');

      if (userID && savedUsername) {
        setIdentifier(savedUsername);
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
    } else if (bmiValue >= 18.5 && bmiValue <= 24.99) {
      category = 'Poids normal';
    } else if (bmiValue >= 25.0 && bmiValue <= 29.99) {
      category = 'Surpoids';
    } else if (bmiValue >= 30.0 && bmiValue <= 34.99) {
      category = 'Obésité modérée';
    } else if (bmiValue >= 35.0 && bmiValue <= 39.99) {
      category = 'Obésité sévère';
    } else if (bmiValue >= 40.0) {
      category = 'Obésité massive';
    }

    setBmiCategory(category);
  };

  const showBmiCategories = () => {
    Alert.alert(
      "Catégories IMC",
      "Insuffisance pondérale (maigreur): <18.5\nPoids normal: 18.5 - 24.99\nSurpoids: 25 - 29.99\nObésité modérée: 30 - 34.99\nObésité sévère: 35 - 39.99\nObésité massive: >=40"
    );
  };
  // Fonction pour se déconnecter
  const handleLogout = async () => {
    try {
        const token = await AsyncStorage.getItem('token'); // Récupère le token JWT

        // Appel à la route logout du backend pour invalider le token
        const response = await fetch('http://192.168.117.86:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok) {
            // Effacer uniquement les données de session
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userID');
            Alert.alert("Succès", "Déconnexion réussie.");
            navigation.replace('Home'); // Redirige vers l'écran de connexion
        } else {
            Alert.alert("Erreur", result.message || "Erreur lors de la déconnexion.");
        }
    } catch (error) {
        console.log("Erreur lors de la déconnexion :", error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion.");
    }
};


  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#451e6a', 'black']}
        style={styles.background}
        />
        {/* Barre de couleur arrondie en haut */}
      {/* <View style={styles.topBarWrapper}>
      <View style={styles.topBar} />
      </View> */}
      <Text style={styles.title}>Bienvenue {capitalizeFirstLetter(identifier)}</Text>
      <Image
        source={profileImage ? { uri: profileImage } : defaultProfileImage}
        style={styles.profileImage}
      />

      {/* Conteneur pour les informations */}
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Âge</Text>
          <Text style={styles.infoValue}>{age}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Sexe</Text>
          <Text style={styles.infoValue}>{gender}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Poids</Text>
          <Text style={styles.infoValue}>{weight} kg</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Taille</Text>
          <Text style={styles.infoValue}>{height} cm</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>IMC</Text>
          <Text style={styles.infoValue}>{bmi}</Text>
        </View>
        <View style={styles.infoBox}>
         <Text style={styles.infoText}>Catégorie IMC</Text>
         <Text style={styles.infoValue} onPress={showBmiCategories}>{bmiCategory}</Text>
        </View>

      </View>

      <Button 
        title="Suivi de l'entraînement" 
        onPress={() => navigation.navigate('Calendar')}
        buttonStyle={{
          backgroundColor: '#ac53a6',
          borderRadius: 15,
          marginTop: 20,
          width: 350,
          borderWidth: 1,
          borderColor: 'white',
        }}
      ></Button>

      {/* Bouton de déconnexion */}
      <Button 
        title="Déconnexion" 
        onPress={handleLogout}
        buttonStyle={{
          backgroundColor: '#451e6a',
          borderRadius: 15,
          marginTop: 20,
          width: 350,
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
    alignItems: 'center',
    padding: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  // topBarWrapper: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   height: 150,
  //   backgroundColor: 'transparent',
  //   zIndex: 1,
  // },
  // topBar: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0, // Ajouté pour coller la barre au bord gauche
  //   right: 0, // Ajouté pour coller la barre au bord droit
  //   bottom: -50,
  //   height: 100,
  //   backgroundColor: '#3b82f6',
  //   borderTopRightRadius: 150,
  // },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 120, // Pour décaler le titre sous la barre
    color: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 10,
  },
  infoGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: {
    width: '45%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
});

export default DashboardScreen;
