import {useState, useEffect, useCallback} from 'react'

import {getCryptoFavorite, getCryptoTopGainersLosers, getCryptoNewListings} from "@/app/services/API/cryptoService";

const useCryptoData = ({mode, uid}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let result = [];
            switch(mode){
                case 'favorites':
                    result = await getCryptoFavorite(uid) || [];
                    break;
                case 'top_gainers':
                    result.push(...await getCryptoTopGainersLosers('gainers') || []);
                    break;
                case 'top_losers':
                    result.push(...await getCryptoTopGainersLosers('losers') || []);
                    break;
                case 'new_listings':
                    result = await getCryptoNewListings('usd', 10) || [];
                    break;
            }
            console.log(result);
            setData(result);
        } catch (error) {
            setError('Failed to fetch crypto data.');
        } finally {
            setLoading(false);
        }
    }, [mode, uid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error };
}

export default useCryptoData;