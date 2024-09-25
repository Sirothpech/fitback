import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const ResetPasswordScreen = ({ route, navigation }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // État pour basculer l'affichage du mot de passe

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleResetPassword = async () => {
        try {
            const response = await axios.post('http://192.168.117.86:3000/reset-password', {
                email,
                verificationCode,
                newPassword,
            });
            Alert.alert('Succès', 'Votre mot de passe a été réinitialisé.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#451e6a', 'black']} style={styles.background} />
            <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Réinitialiser le mot de passe</Text>
            <TextInput
                style={styles.input}
                placeholder="Votre Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Code de vérification"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
            />
            <View style={styles.passwordContainer}>
            <TextInput
                    style={styles.inputPassword} // Ajuste ce style séparément pour le mot de passe
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
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
                title="Réinitialiser"
                onPress={handleResetPassword}
                buttonStyle={{
                    backgroundColor: 'rgba(61, 153, 245, 1)',
                    borderRadius: 15,
                    margin: 10,
                }}
            />
        </View>
    );
};

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
    passwordContainer: {
        width: '90%',  // Ajuste la largeur du conteneur pour être cohérente avec les autres inputs
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    input: {
        width: '90%',
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

export default ResetPasswordScreen;
