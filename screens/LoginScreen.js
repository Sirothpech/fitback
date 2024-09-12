import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password
            });
            
            const { token, userId } = response.data;

            // Sauvegarder le token et le userId dans AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userID', userId.toString());
            await AsyncStorage.setItem('username', username);

            Alert.alert("Succès", "Connexion réussie !");
            navigation.navigate('Dashboard');
        } catch (error) {
            Alert.alert("Erreur", "Échec de la connexion !");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button 
            title="LOGIN" 
            onPress={handleLogin}
            buttonStyle={{
                backgroundColor: 'rgba(61, 153, 245, 1)',
                borderRadius: 30,
                width: 100,
                margin: 10,
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
});

export default LoginScreen;
