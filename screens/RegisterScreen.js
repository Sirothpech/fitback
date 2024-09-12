import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL de ton serveur backend, remplace localhost par ton IP si tu utilises un émulateur (ifconfig sur Linux, ipconfig sur Windows)
function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                username,
                password,
                email
            });
            Alert.alert("Succès", "Utilisateur enregistré !");
            console.log(response.data);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Erreur", "Échec de l'enregistrement !");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Register</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button 
            style={styles.buttonsContainer}
            title="REGISTER" 
            onPress={handleRegister}
            buttonStyle={{
                backgroundColor: 'rgba(111, 180, 250, 1)',
                borderRadius: 15,
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
    input: {
        width: '100%',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
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
