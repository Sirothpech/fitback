import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { color } from '@rneui/base';

const API_URL = 'http://192.168.117.86:3000';

function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // État pour basculer l'affichage du mot de passe

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Fonction pour valider l'email
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    
    // Fonction pour valider le mot de passe
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async () => {
        // Vérification du format de l'email
        if (!validateEmail(email)) {
            Alert.alert("Erreur", "Veuillez entrer un email valide.");
            return;
        }
    
        // Vérification du format du mot de passe
        if (!validatePassword(password)) {
            Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.");
            return;
        }
    
        try {
            console.log("Envoi de la requête d'inscription...");
            const response = await axios.post(`${API_URL}/register`, {
                username,
                password,
                email
            });
            console.log("Réponse de l'API : ", response.data);
            Alert.alert("Succès", "Utilisateur enregistré !");
            navigation.navigate('Login');
        } catch (error) {
            console.log("Erreur lors de l'enregistrement : ", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 400) {
                Alert.alert("Erreur", "Nom d'utilisateur ou email déjà utilisé.");
            } else {
                Alert.alert("Erreur", "Erreur lors de l'enregistrement de l'utilisateur.");
            }
        }
    };
    

    return (
        <View style={styles.container}>
            <LinearGradient
        // Background Linear Gradient
        colors={['#451e6a', 'black']}
        style={styles.background}
        />
            <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
                        {/* Champ du mot de passe avec icône œil */}
                        <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword} // Ajuste ce style séparément pour le mot de passe
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible} // Basculer entre affichage et masquage du mot de passe
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                    <Icon 
                        name={isPasswordVisible ? 'eye' : 'eye-off'} 
                        type='feather' 
                        size={24} 
                        color="gray" 
                    />
                </TouchableOpacity>
            </View>
            <Button 
            style={styles.buttonsContainer}
            title="REGISTER" 
            onPress={handleRegister}
            buttonStyle={{
                backgroundColor: 'rgba(245, 176, 61, 1)',
                borderRadius: 15,
                margin: 10,
              }}
              icon={{
                name: "user-plus",
                type: 'font-awesome-5',
                size: 15,
                color: "white"
              }} />
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
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    input: {
        width: '90%',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        backgroundColor: '#fff',
        // Ombres portées
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5, // Ombre pour Android
    },
    passwordContainer: {
        width: '90%',  // Ajuste la largeur du conteneur pour être cohérente avec les autres inputs
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    inputPassword: {
        flex: 1,  // Prend toute la largeur disponible
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    icon: {
        position: 'absolute',
        right: 10, // Positionne l'icône à droite
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
});

export default RegisterScreen;
