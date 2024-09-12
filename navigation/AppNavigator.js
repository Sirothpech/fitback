import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TimerScreen from '../screens/TimerScreen';
import ChronometerScreen from '../screens/ChronometerScreen';
import TimerTabataScreen from '../screens/TimerTabataScreen';
import NutritionScreen from '../screens/NutritionScreen';
import RecipeScreen from '../screens/RecipeScreen';

// Crée les navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator pour la navigation en bas (onglets)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Timer') {
            iconName = 'timer';
          } else if (route.name === 'Nutrition') {
            iconName = 'nutrition';
          } else if (route.name === 'Recipe') {
            iconName = 'restaurant';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Recipe" component={RecipeScreen} />
    </Tab.Navigator>
  );
}


// Stack Navigator principal
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* Ajoute TabNavigator comme écran Dashboard */}
      <Stack.Screen name="Chronometer" component={ChronometerScreen} />
      <Stack.Screen name="TimerTabata" component={TimerTabataScreen} />
      <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
