'use client'
import styles from "./CryptoList.module.css";

import { useEffect, useState } from "react";

import { getCryptos } from "../../services/cryptoService";

const CryptoList = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCryptos = async () => {
          try {
            const data = await getCryptos('usd', 10);
            setCryptos(data);
          } catch (error) {
            setError('Failed to fetch crypto data.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCryptos();
    }, []);

      
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
          <h2>Crypto Prices</h2>
          <ul>
            {cryptos.map((crypto) => (
              <li key={crypto.id}>
                {crypto.name}: ${crypto.current_price}
              </li>
            ))}
          </ul>
        </div>
      );
    };
    
export default CryptoList;