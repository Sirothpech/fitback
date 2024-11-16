const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

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
  const { identifier, password } = req.body;

  try {
      const [user] = await db.execute(
          'SELECT * FROM users WHERE username = ? OR email= ?',
          [identifier, identifier]
      );

      if (!user.length) {
          return res.status(401).send({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const isValid = await bcrypt.compare(password, user[0].password);

      if (!isValid) {
          return res.status(401).send({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign({ userId: user[0].id, username: user[0].username }, process.env.SECRET_KEY, { expiresIn: '1h' });

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
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
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

// Route pour récupérer le profil utilisateur
app.get('/getUserProfile', async (req, res) => {
  const { userID } = req.query;

  try {
      const [userProfile] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userID]);

      if (userProfile.length > 0) {
          res.status(200).send(userProfile[0]);
      } else {
          res.status(404).send({ message: 'Profil utilisateur non trouvé' });
      }
  } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la récupération du profil utilisateur' });
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

  const crypto = require('crypto');

  // Route pour récupérer le mot de passe oublié
  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (!user.length) {
            return res.status(404).send({ message: "Utilisateur non trouvé" });
        }

        // Générer un code de vérification à 6 chiffres
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        console.log("Code de vérification généré :", verificationCode);

        // Vérifier si une session existe déjà pour l'utilisateur
        const [session] = await db.execute('SELECT * FROM sessions WHERE user_id = ?', [user[0].id]);

        if (session.length > 0) {
            // Mise à jour de la session existante avec le code de vérification
            const [updateResult] = await db.execute(
                'UPDATE sessions SET verification_code = ? WHERE user_id = ?',
                [verificationCode, user[0].id]
            );
            console.log("Résultat de la mise à jour :", updateResult);
        } else {
            // Créer une nouvelle session avec le code de vérification
            const [insertResult] = await db.execute(
                'INSERT INTO sessions (user_id, verification_code) VALUES (?, ?)',
                [user[0].id, verificationCode]
            );
            console.log("Résultat de l'insertion :", insertResult);
        }

        // Envoi de l'email avec le code de vérification
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS
          }
      });
      

        const mailOptions = {
            from: 'christophe.ngan@gmail.com',
            to: email,
            subject: 'Code de vérification pour réinitialiser votre mot de passe',
            html: `<p>Votre code de vérification est : <strong>${verificationCode}</strong></p>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email envoyé: ' + info.response);
            }
        });

        res.status(200).send({ message: "Email de vérification envoyé" });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la demande de vérification" });
    }
});



// Route pour réinitialiser le mot de passe
app.post('/reset-password', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
      // Récupérer le user_id en utilisant l'email
      const [user] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

      if (!user.length) {
          return res.status(404).send({ message: "Utilisateur non trouvé" });
      }

      const userId = user[0].id;

      // Vérifier le code de vérification dans la table sessions en utilisant user_id
      const [session] = await db.execute('SELECT * FROM sessions WHERE verification_code = ? AND user_id = ?', [verificationCode, userId]);

      if (!session.length) {
          return res.status(400).send({ message: "Code de vérification invalide ou expiré" });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe de l'utilisateur
      await db.execute(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, userId]
      );

      // Optionnel : Supprimer ou invalider le code de vérification après utilisation
      await db.execute('UPDATE sessions SET verification_code = NULL WHERE user_id = ?', [userId]);

      res.status(200).send({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
      res.status(400).send({ message: "Erreur lors de la réinitialisation du mot de passe" });
  }
});





app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

