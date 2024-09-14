
---

# FitBack

FitBack is a mobile fitness application that helps users monitor their physical activities, manage their workout timers, track personal data (such as weight, height, and BMI), and access nutritional information with meal tracking and healthy recipes.

## Features

- **User Profiles**: Users can create an account, log in, and manage their personal profile information such as age, gender, weight, and height.
- **BMI Calculation**: The app automatically calculates the BMI (Body Mass Index) based on the user's height and weight, and provides a BMI category.
- **Workout Timers**: Includes a standard timer, a stopwatch, and a Tabata timer for interval workouts.
- **Nutritional Information**: Users can search for food items and get detailed nutritional information, including calories, fats, carbohydrates, and proteins.
- **Recipes**: Users can search for healthy recipes, see detailed ingredients, and view nutritional values.
- **User Authentication**: Secure registration and login system using JWT (JSON Web Tokens).

## Setup

### Prerequisites

- Node.js and npm
- Expo CLI
- MySQL database

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/fitback.git
    cd fitback
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the MySQL database:
    - Create a database named `fitback`.
    - Use the following SQL to create the necessary `users`, `user_profiles` and `user_activties tables:
    ```sql
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE user_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        age INT,
        gender VARCHAR(255),
        weight FLOAT,
        height FLOAT,
        profile_image TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE user_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        exercise TEXT,
        meal TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ```

4. Update the database connection in `backend/database.js`:
    ```js
    const pool = mysql.createPool({
        host: 'localhost', // or your server IP
        user: 'root', // your MySQL username
        database: 'fitback', // your MySQL database name
        password: 'yourpassword' // your MySQL password
    });
    ```

5. Start the backend server:
    ```bash
    cd backend
    npm start
    ```

6. Start the mobile app:
    ```bash
    cd ..
    npx expo start
    ```

## Usage

- Use the Expo Go app to run the app on your mobile device or use an Android/iOS emulator.
- Navigate between the user profile, workout timers, nutrition search, and recipe sections.
- Register or log in to access your profile and save your data.

## Built With

- **React Native**: For building the mobile application.
- **Expo**: For easier development and deployment of the mobile app.
- **Node.js & Express**: For the backend API.
- **MySQL**: As the database to store user information.


--- 
