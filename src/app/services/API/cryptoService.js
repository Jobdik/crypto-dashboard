import Axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// Base URL for CoinGecko public API endpoint and rate limiter
const hhtp = axiosRateLimit(Axios.create( { baseURL: 'https://api.coingecko.com/api/v3' } ), { maxRequests: 5, perMilliseconds: 5000 });

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
    const response = await hhtp.get(
      `/simple/price`,
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
    const response = await hhtp.get(
      `/coins/markets`,
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

export const getCryptoFavorite = async (uid) => {
  if(!uid) return null;

  try{
    const db = getFirestore();
    const userRef = doc(db, "users", uid.uid);
    const userSnap = await getDoc(userRef);
    // Extract the 'favorite' array or return an empty array if none
    const favorite = userSnap.data()?.favorite || [];

    if(favorite.length > 0){
      // Limit to the first 10 favorite coins
      const ids = favorite.slice(0, 10).join(',');
      // Fetch market data for the selected coins from CoinGecko API
      const response = await hhtp.get(
        `/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            ids: ids, 
          },
        }
      )
      const data = response.data || [];
      // Filter and return only the required fields
      const filteredData = data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price,
        total_volume: coin.total_volume,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
        favorite: true
      }));
      return filteredData || [];
    }
    else{
      return null
    }
  } catch (error) {
    console.log("Error in getCryptoFavorite:",error);
    return null;
  }

};

export const getCryptoTopGainersLosers = async () => {
  try {
    const response = await hhtp.get(
      `/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order:'percent_change_24h_desc',
          per_page: 100,
          page:1,
          price_change_percentage: '24h',
        },
      }
    );
    const data = response.data || [];

    // Filter and return only the required fields
    const filteredData = data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      total_volume: coin.total_volume,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h, 
    }));
    // Sort data by increasing price_change_percentage_24h  
    filteredData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

    // Return top 10 gainers and top 10 losers
    const topGainers = filteredData.slice(0, 10);
    const topLosers = filteredData.slice(-10);
    
    return { topGainers, topLosers } || [];

  }
  catch (error) {
   console.log("Error in getCryptoTopGainersLosers:",error);
   return null; 
  }
};


export const getCryptoNewListings = async () => {
  try {
    const response = await hhtp.get(
      `/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order:'market_cap_asc',
          per_page: 10,
          page:1,
        },
      }
    );
    const data = response.data || [];
    const filteredData = data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      total_volume: coin.total_volume,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
    }))
    return filteredData || [];
  }
  catch (error) {
   console.log("Error in getCryptoNewListings:",error);
   return null; 
  }
};