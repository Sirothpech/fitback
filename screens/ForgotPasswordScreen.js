import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://192.168.117.86:3000/forgot-password', { email });
            Alert.alert('Succès', 'Un email de réinitialisation a été envoyé.');
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#451e6a', 'black']} style={styles.background} />
            <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Mot de passe oublié</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button
                title="Envoyer"
                onPress={handleForgotPassword}
                buttonStyle={{
                    backgroundColor: 'rgba(61, 153, 245, 1)',
                    borderRadius: 15,
                    margin: 10,
                }}
            />
            <Text style={{ color: 'white', marginTop: 20 }}
            onPress={() => navigation.navigate('ResetPassword')}>Entrez le code reçu par email</Text>
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
});

export default ForgotPasswordScreen;
