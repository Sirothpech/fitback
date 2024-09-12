import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const defaultProfileImage = require('../assets/default-profile.jpeg');

function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    loadUserID();
  }, []);

  const loadUserID = async () => {
    try {
      const id = await AsyncStorage.getItem('userID');
      if (id) {
        setUserID(id);
        console.log('UserID:', id);
        loadUserData(id);
      } else {
        Alert.alert("Erreur", "Utilisateur non trouvé");
      }
    } catch (error) {
      console.log("Erreur lors du chargement de l'ID utilisateur", error);
    }
  };

  const loadUserData = async (id) => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      console.log("Nom d'utilisateur récupéré :", savedUsername);

      if (id && savedUsername) {
        setUsername(savedUsername);
        const savedAge = await AsyncStorage.getItem(`${id}_age`);
        const savedGender = await AsyncStorage.getItem(`${id}_gender`);
        const savedWeight = await AsyncStorage.getItem(`${id}_weight`);
        const savedHeight = await AsyncStorage.getItem(`${id}_height`);
        const savedProfileImage = await AsyncStorage.getItem(`${id}_profileImage`);

        if (savedAge) setAge(savedAge);
        if (savedGender) setGender(savedGender);
        if (savedWeight) setWeight(savedWeight);
        if (savedHeight) setHeight(savedHeight);
        if (savedProfileImage) setProfileImage(savedProfileImage);
      } else {
        console.log("Aucun utilisateur trouvé");
      }
    } catch (error) {
      console.log("Erreur lors du chargement des données utilisateur :", error);
    }
  };

  const saveUserData = async () => {
    if (!userID) return;

    try {
      await AsyncStorage.setItem(`${userID}_age`, age);
      await AsyncStorage.setItem(`${userID}_gender`, gender);
      await AsyncStorage.setItem(`${userID}_weight`, weight);
      await AsyncStorage.setItem(`${userID}_height`, height);
      if (profileImage) {
        await AsyncStorage.setItem(`${userID}_profileImage`, profileImage);
      }

      const response = await axios.post('http://localhost:3000/saveProfile', {
        userID,
        age,
        gender,
        weight,
        height,
        profileImage
      });

      if (response.status === 200) {
        Alert.alert("Succès", "Données sauvegardées avec succès");
      } else {
        Alert.alert("Erreur", "Échec de la sauvegarde des données");
      }
    } catch (error) {
      if (error.response) {
        console.log("Erreur de l'API lors de la sauvegarde des données :", error.response.data);
      } else if (error.request) {
        console.log("Aucune réponse reçue lors de la requête :", error.request);
      } else {
        console.log("Erreur lors de la sauvegarde des données :", error.message);
      }
    }
  };

  const calculateBMI = () => {
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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setProfileImage(selectedImageUri);
      if (userID) {
        await AsyncStorage.setItem(`${userID}_profileImage`, selectedImageUri);
      }
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profil de {capitalizeFirstLetter(username)}</Text>

      <Image
        source={profileImage ? { uri: profileImage } : defaultProfileImage}
        style={styles.profileImage}
      />

      <Button
        title="Choisir une Photo de Profil"
        onPress={pickImage}
        buttonStyle={{
          backgroundColor: 'rgba(61, 153, 245, 1)',
          borderRadius: 15,
          margin: 10,
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Âge"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Sexe"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Poids (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Taille (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Button
        title="Calculez votre IMC"
        onPress={calculateBMI}
        buttonStyle={{
          backgroundColor: 'rgba(61, 153, 245, 1)',
          borderRadius: 15,
          margin: 10,
        }}
      />

      {bmi && (
        <View>
          <Text style={styles.bmiResult}>Votre IMC est de {bmi}</Text>
          <Text style={styles.bmiCategory}>Catégorie : {bmiCategory}</Text>
        </View>
      )}

      <Button
        title="Sauvegarder"
        onPress={saveUserData}
        buttonStyle={{
          backgroundColor: 'rgba(61, 153, 245, 1)',
          borderRadius: 15,
          margin: 10,
        }}
      />

      <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
        <Text style={styles.infoButton}>Infos</Text>
      </TouchableOpacity>

      {showInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Le tour de taille, un autre indicateur important de surpoids ou d'obésité.
            Le tour de taille est un autre indicateur. Il donne une image simple de l’excès de graisse accumulé au niveau de votre abdomen.
          </Text>
          <Text style={styles.infoText}>
            Le tour de taille est jugé trop élevé s’il est supérieur ou égal à :
          </Text>
          <Text style={styles.infoText}>80 cm pour une femme</Text>
          <Text style={styles.infoText}>94 cm pour un homme</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  bmiResult: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: 'green',
  },
  bmiCategory: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
  },
  infoButton: {
    fontSize: 12,
    color: 'blue',
    textAlign: 'center',
    margin: 10,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProfileScreen;
