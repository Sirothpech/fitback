const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Inscription d'un nouvel utilisateur
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Tentative d'enregistrement avec : ", { username, email });

    try {
        // Vérifier si l'e-mail existe déjà
        const [existingEmail] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            console.log("Email déjà utilisé : ", email);
            return res.status(400).send({ message: "L'email est déjà utilisé. Veuillez en choisir un autre." });
        }

        // Vérifier si le nom d'utilisateur existe déjà
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            console.log("Nom d'utilisateur déjà utilisé : ", username);
            return res.status(400).send({ message: "Le nom d'utilisateur est déjà utilisé. Veuillez en choisir un autre." });
        }

        console.log("Hachage du mot de passe...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Mot de passe haché, insertion dans la base de données.");

        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        console.log("Utilisateur créé avec succès, ID :", result.insertId);

        res.status(201).send({ message: 'Utilisateur créé !', userId: result.insertId });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement : ", error.message);
        res.status(500).send({ message: "Erreur lors de la création de l'utilisateur: " + error.message });
    }
});



app.get('/', (req, res) => {
	res.send('Bienvenue sur FitBack!');
    });

// Connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const [user] = await db.execute(
          'SELECT * FROM users WHERE username = ?',
          [username]
      );

      if (!user.length) {
          return res.status(401).send({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const isValid = await bcrypt.compare(password, user[0].password);

      if (!isValid) {
          return res.status(401).send({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign({ userId: user[0].id, username: user[0].username }, 'SECRET_KEY', { expiresIn: '1h' });

      // Sauvegarder le token dans la table sessions
      await db.execute(
          'INSERT INTO sessions (user_id, jwt_token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
          [user[0].id, token]
      );

      // Envoyer le token au client
      res.send({ token, userId: user[0].id });
  } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la connexion' });
  }
});

// Déconnexion
app.post('/logout', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({ message: "Aucun token fourni." });
  }

  try {
    // Vérifie si le token est valide
    jwt.verify(token, 'SECRET_KEY', async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Token invalide ou expiré." });
      }

      // Supprime le token de la table session
      const userId = decoded.userId;
      await db.execute('DELETE FROM sessions WHERE jwt_token = ?', [token]);

      return res.status(200).send({ message: "Déconnexion réussie." });
    });
  } catch (error) {
    return res.status(500).send({ message: "Erreur lors de la déconnexion : " + error.message });
  }
});





app.post('/saveProfile', async (req, res) => {
    const { userID, age, gender, weight, height, profileImage } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userID]);

        if (user.length > 0) {
            // Mettre à jour les données si elles existent déjà
            await db.execute(
                'UPDATE user_profiles SET age = ?, gender = ?, weight = ?, height = ?, profile_image = ? WHERE user_id = ?',
                [age, gender, weight, height, profileImage, userID]
            );
        } else {
            // Insérer de nouvelles données
            await db.execute(
                'INSERT INTO user_profiles (user_id, age, gender, weight, height, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
                [userID, age, gender, weight, height, profileImage]
            );
        }

        res.status(200).send({ message: 'Profil sauvegardé avec succès' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la sauvegarde du profil : ' + error.message });
    }
});

// Route pour récupérer les activités pour une date donnée
app.get('/getActivity', async (req, res) => {
    const { userID, date } = req.query;
  
    try {
      const [activity] = await db.execute(
        'SELECT exercise, meal FROM user_activities WHERE user_id = ? AND date = ?',
        [userID, date]
      );
      
      if (activity.length > 0) {
        res.status(200).send(activity[0]);
      } else {
        res.status(200).send({ exercise: '', meal: '' });
      }
    } catch (error) {
      res.status(500).send({ message: "Erreur lors de la récupération des activités", error });
    }
  });
  
  // Route pour sauvegarder les activités pour une date donnée
  app.post('/saveActivity', async (req, res) => {
    const { userID, date, exercise, meal } = req.body;
  
    try {
      const [existingActivity] = await db.execute(
        'SELECT * FROM user_activities WHERE user_id = ? AND date = ?',
        [userID, date]
      );
  
      if (existingActivity.length > 0) {
        // Mettre à jour l'activité existante
        await db.execute(
          'UPDATE user_activities SET exercise = ?, meal = ? WHERE user_id = ? AND date = ?',
          [exercise, meal, userID, date]
        );
      } else {
        // Insérer une nouvelle activité
        await db.execute(
          'INSERT INTO user_activities (user_id, date, exercise, meal) VALUES (?, ?, ?, ?)',
          [userID, date, exercise, meal]
        );
      }
  
      res.status(200).send({ message: "Activités sauvegardées avec succès" });
    } catch (error) {
      res.status(500).send({ message: "Erreur lors de la sauvegarde des activités", error });
    }
  });


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
