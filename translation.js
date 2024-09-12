import axios from 'axios';

const apiKey = 'API_KEY_GOOGLE_CLOUD_TRANSLATE'; // Ta clé API Google Cloud

/**
 * Fonction pour traduire du texte vers une langue cible.
 * @param {string} text - Le texte à traduire.
 * @param {string} targetLang - La langue cible (par défaut 'en' pour l'anglais).
 * @returns {Promise<string>} - Le texte traduit.
 */
const translateText = async (text, targetLang = 'en') => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      q: text, // Le texte à traduire
      target: targetLang, // La langue cible
    });
    
    const translatedText = response.data.data.translations[0].translatedText;
    console.log('Texte traduit:', translatedText);
    return translatedText;
  } catch (error) {
    console.error('Erreur de traduction:', error.response ? error.response.data : error.message);
    return null;
  }
};

export default translateText;
