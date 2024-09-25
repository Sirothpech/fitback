import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const defaultProfileImage = require('../assets/default-profile.jpeg');

function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
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

      const response = await axios.post('http://192.168.117.86:3000/saveProfile', {
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
      console.log("Erreur lors de la sauvegarde des données :", error.message);
    }
  };


  const pickImage = async () => {
    const options = [
        {
            text: "Prendre une photo",
            onPress: takePhoto
        },
        {
            text: "Choisir dans la galerie",
            onPress: chooseFromGallery
        },
        {
            text: "Annuler",
            style: "cancel"
        }
    ];

    Alert.alert("Sélectionner une option", "", options);
};

const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
        alert("Permission to access camera is required!");
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

const chooseFromGallery = async () => {
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


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#451e6a', 'black']} style={styles.background} />
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Profil de {username}</Text>

          <Image
            source={profileImage ? { uri: profileImage } : defaultProfileImage}
            style={styles.profileImage}
          />

          <Button
            buttonStyle={styles.button}
            onPress={pickImage}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["rgba(61, 153, 245, 1)", "rgba(61, 100, 245, 1)"],
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },
            }}
          >
            Choisir une Photo de Profil
          </Button>

          <TextInput style={styles.input} placeholder="Âge" keyboardType="numeric" value={age} onChangeText={setAge} />
          <TextInput style={styles.input} placeholder="Sexe" value={gender} onChangeText={setGender} />
          <TextInput style={styles.input} placeholder="Poids (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
          <TextInput style={styles.input} placeholder="Taille (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />

          <Button
            buttonStyle={styles.button}
            onPress={saveUserData}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["rgba(61, 153, 245, 1)", "rgba(61, 100, 245, 1)"],
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },
            }}
          >
            Sauvegarder
          </Button>

          <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
            <Text style={styles.infoButton}>Infos</Text>
          </TouchableOpacity>

          {showInfo && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Le tour de taille est un indicateur important de l’accumulation de graisse au niveau de votre abdomen.
              </Text>
              <Text style={styles.infoText}>80 cm pour une femme et 94 cm pour un homme sont des seuils d’alerte.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  innerContainer: {
    flex: 1,
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 15,
    margin: 10,
    borderColor: 'white',
    borderWidth: 1,
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
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },
});

export default ProfileScreen;
