import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // État pour basculer l'affichage du mot de passe

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.117.86:3000/login', {
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
            <LinearGradient
                // Background Linear Gradient
                colors={['#451e6a', 'black']}
                style={styles.background}
            />
            <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Login</Text>
            
            {/* Champ du nom d'utilisateur */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
                title="LOGIN" 
                onPress={handleLogin}
                buttonStyle={{
                    backgroundColor: 'rgba(61, 153, 245, 1)',
                    borderRadius: 15,
                    margin: 10,
                }}
                icon={{
                    name: "login",
                    size: 15,
                    color: "white",
                }}
                iconRight={true} 
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
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    input: {
        width: '90%',  // Ajuste la largeur des inputs pour qu'ils soient cohérents
        marginVertical: 10,
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
});

export default LoginScreen;
