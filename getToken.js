import axios from 'axios';
import qs from 'qs'; // Pour encoder les paramètres en x-www-form-urlencoded

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET_ID';

const getToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await axios.post('https://oauth.fatsecret.com/connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du jeton:', error.response ? error.response.data : error.message);
  }
};

export default getToken;
