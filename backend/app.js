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
	const hashedPassword = await bcrypt.hash(password, 10);
    
	// Enregistrement de l'utilisateur dans la base de données
	try {
	    const [result] = await db.execute(
		'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
		[username, email, hashedPassword]
	    );
	    res.status(201).send({ message: 'Utilisateur créé !', userId: result.insertId });
	} catch (error) {
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

        const token = jwt.sign({ userId: user[0].id, username: user[0].username }, 'SECRET_KEY', { expiresIn: '1h' });

        res.send({ token, userId: user[0].id });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la connexion' });
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


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
