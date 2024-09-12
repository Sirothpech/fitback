import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import getToken from '../getToken';
import translateText from '../translation';
import axios from 'axios';

function RecipeScreen() {
  const [recipeQuery, setRecipeQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState(null); // État pour les ingrédients de la recette sélectionnée

  const searchRecipe = async () => {
    try {
      const translatedQuery = await translateText(recipeQuery, 'en');
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
        'https://platform.fatsecret.com/rest/server.api',
        null,
        {
          params: {
            method: 'recipes.search',
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

      const recipeResults = response.data.recipes.recipe || [];
      setResults(recipeResults);
      setSelectedRecipeIngredients(null); // Réinitialiser l'affichage des ingrédients
    } catch (error) {
      console.error('Erreur lors de la recherche des recettes:', error.response ? error.response.data : error.message);
    }
  };

  const getRecipeIngredients = async (recipeId) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        'https://platform.fatsecret.com/rest/server.api',
        null,
        {
          params: {
            method: 'recipe.get',
            recipe_id: recipeId,
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

      // Utiliser le bon chemin pour les ingrédients
      const ingredients = response.data.recipe.ingredients?.ingredient || [];
      setSelectedRecipeIngredients(ingredients); // Mettre à jour l'état avec les ingrédients
    } catch (error) {
      console.error('Erreur lors de la récupération des ingrédients:', error);
    }
  };

  // Formater le nombre d'unités pour supprimer les décimales inutiles
  const formatUnits = (units) => {
    return parseFloat(units) % 1 === 0 ? parseInt(units) : parseFloat(units).toFixed(2);
  };

  // Afficher les ingrédients correctement avec leur description
  const renderIngredientItem = ({ item }) => (
    <Text style={styles.ingredient}>
      {formatUnits(item.number_of_units)} {item.measurement_description} de {item.food_name}
    </Text>
  );

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity onPress={() => getRecipeIngredients(item.recipe_id)}>
      <View style={styles.recipeItem}>
        <Image source={{ uri: item.recipe_image }} style={styles.recipeImage} />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{item.recipe_name}</Text>
          <Text style={styles.recipeDescription}>{item.recipe_description}</Text>
        
          {/* Afficher les informations nutritionnelles */}
          <Text style={styles.recipeDescription}>Calories: {item.recipe_nutrition.calories}</Text>
          <Text style={styles.recipeDescription}>Glucides: {item.recipe_nutrition.carbohydrate} g</Text>
          <Text style={styles.recipeDescription}>Graisses: {item.recipe_nutrition.fat} g</Text>
          <Text style={styles.recipeDescription}>Protéines: {item.recipe_nutrition.protein} g</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recherche de recettes"
        value={recipeQuery}
        onChangeText={setRecipeQuery}
      />
      <Button title="Rechercher" onPress={searchRecipe} />

      {/* Afficher les ingrédients de la recette sélectionnée */}
      {selectedRecipeIngredients ? (
        <View style={styles.ingredientsContainer}>
          <Text style={styles.recipeTitle}>Ingrédients :</Text>
          <FlatList
            data={selectedRecipeIngredients}
            renderItem={renderIngredientItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.recipe_id.toString()}
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
  recipeItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  ingredientsContainer: {
    marginTop: 20,
  },
  ingredient: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default RecipeScreen;
