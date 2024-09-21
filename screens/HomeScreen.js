import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@rneui/themed';

function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Image
                source={require('../assets/logo-fitback.png')} 
                style={styles.logo}
            />
            <Button 
                style={styles.buttonsContainer}
                title="LOG IN" 
                onPress={() => navigation.navigate('Login')}
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

            <Button 
                style={styles.buttonsContainer}
                title="REGISTER" 
                onPress={() => navigation.navigate('Register')}
                buttonStyle={{
                    backgroundColor: 'rgba(245, 176, 61, 1)',
                    borderRadius: 15,
                }} 
                icon={{
                    name: "user-plus",
                    type: 'font-awesome-5',
                    size: 15,
                    color: "white"
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
    },
    welcomeText: {
        fontSize: 24, // Taille du texte
        marginBottom: 0, // Ajuste la marge inférieure pour rapprocher du logo
    },
    logo: {
        width: 200,
        resizeMode: 'contain',
        marginTop: 0,
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

export default HomeScreen;
