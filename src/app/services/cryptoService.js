import Axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const getCryptos = async (currency = 'usd', perPage = 20) => {
    try {
        const response = await Axios.get(`${API_URL}/coins/markets`, {
            params: {
                vs_currency: currency,
                order: 'market_cap_desc',
                per_page: perPage,
                page: 1,
                sparkline: false,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getCrypto = async (id, currency = 'usd') => {
    try {
        const response = await Axios.get(`${API_URL}/coins/${id}/market_chart`, {
            params: {
                vs_currency: currency,
                days,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getCryptoHistory = async (id, currency = 'usd', days = 30) => {
    try{
        const response = await Axios.get(`${API_URL}/coins/${id}/market_chart`, {
            params: {
                vs_currency: currency,
                days,
            },
        });
        return response.data.prices;
    } catch (error) {
        console.log(error);
    }
    
}