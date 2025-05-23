import Axios from 'axios';

// Base URL for CoinGecko public API endpoint
const API_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetches current USD prices for an array of cryptocurrency IDs
 *@param {string[]} symbol
 *@returns {Promise<object> || null}
*/
export const getCtyptoPrices = async (symbol = []) => {
  // If no symbols provided, nothing to fetch
  if(!symbol) return null;
  // Build comma-separated list of IDs
  try{
    const response = await Axios.get(
      `${API_URL}/simple/price`,
      {
        params: {
          vs_currencies: 'usd',
          ids: symbol.join(','),
        },
      }
    )
    // Return data object or null if undefined
    return response.data || null; 
  } catch (error) {
    // Log and return null on failure
    console.log("Error in getCtyptoPrices:",error);
    return null;
  } 
}

/**
 * Fetches market data for a single cryptocurrency
 *@param {string[]} symbol
 *@returns {Promise<object> || null}
*/
export const getCryptoInfos = async (symbol) => {
   // If no symbols provided, nothing to fetch
  if(!symbol) return null;
  try{
    const response = await Axios.get(
      `${API_URL}/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          ids: symbol.toLowerCase(), 
        },
      }
    );

    return response.data[0] || null;
  } catch (error) {
    // Log error and return null
    console.log("Error in getCryptoInfos:",error);
    return null;
  }
};