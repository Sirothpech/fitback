import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';
import getToken from '../getToken';
import translateText from '../translation';
import axios from 'axios';

function NutritionScreen() {
  const [foodQuery, setFoodQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchFood = async () => {
    try {
      const translatedQuery = await translateText(foodQuery, 'en');
      if (!translatedQuery) {
        console.error('Erreur lors de la traduction');
        return;
      }

      const token = await getToken();
      if (!token) {
        console.error("Impossible d'obtenir un jeton d'accès");
        return;
      }

      const response = await axios.post(
        'https://platform.fatsecret.com/rest/foods/search/v1',
        null,
        {
          params: {
            method: 'foods.search',
            search_expression: translatedQuery,
            format: 'json',
            region: 'FR',
            language: 'fr',
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const foodResults = response.data.foods.food || [];
      setResults(foodResults);
    } catch (error) {
      console.error('Erreur lors de la recherche des aliments:', error.response ? error.response.data : error.message);
    }
  };

  // Composant pour afficher chaque résultat sans image
  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodTitle}>{item.food_name}</Text>
        <Text style={styles.foodDescription}>Marque: {item.brand_name}</Text>
        <Text style={styles.foodDescription}>
          Calories: {item.food_description.split(' - ')[1]}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recherche d'aliments"
        value={foodQuery}
        onChangeText={setFoodQuery}
      />
      <Button title="Rechercher" onPress={searchFood} />
      {results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.food_id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  foodItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default NutritionScreen;