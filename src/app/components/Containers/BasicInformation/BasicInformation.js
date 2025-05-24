import styles from "./BasicInformation.module.css";

import { useEffect, useState } from "react";

import {getCryptoFavorite, getCryptoTopGainersLosers, getCryptoNewListings} from "@/app/services/API/cryptoService";


// BasicInformation component: displays asset overview with filtering modes and loading/error handling
const BasicInformation = (uid) => {
    // State for fetched data (favorites, top traders, gainers, etc.)
    const [data, setData] = useState([{name: 'Bitcoin',symbol: 'BTC',image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',current_price: 40000,total_volume: 4000,price_change_percentage_24h: -2,market_cap_change_percentage_24h: -5},
        {name: 'Bitcoin',symbol: 'BTC',image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',current_price: 40000,total_volume: 4000,price_change_percentage_24h: -2,market_cap_change_percentage_24h: -5},
        {name: 'Bitcoin',symbol: 'BTC',image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',current_price: 40000,total_volume: 4000,price_change_percentage_24h: -2,market_cap_change_percentage_24h: -5},
        {name: 'Bitcoin',symbol: 'BTC',image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',current_price: 40000,total_volume: 4000,price_change_percentage_24h: -2,market_cap_change_percentage_24h: -5},
    ]);
    // Mode controls which dataset to fetch/display
    const [mode, setMode] = useState('favorites');
    // Loading indicator state
    const [loading, setLoading] = useState(false);
    // Error state for fetch failures
    const [error, setError] = useState(null);

    // Effect to fetch data whenever 'mode' changes
    useEffect(() => {
        setLoading(false);
        setError(null);
        // Placeholder: switch on mode to call appropriate fetch function
        switch (mode) {
            case 'favorites': 
                break;
            case 'top_tradet':
                break;
            case 'top_gainers':
                break;
            case 'top_loosers':
                break;
            case 'newly_listed':
                break;
            default:
                break;
        }
    }, [mode]);
    return (
        <div className={styles.container}>
            {/* Mode selection buttons */}
            <div className={styles.top_buttons_container}>
                <div className={styles.top_buttons}>
                    <button className={styles.button} onClick={() => setMode('favorites')}>Favourite</button>
                    <button className={styles.button} onClick={() => setMode('top_tradet')}>Top Tradet</button>
                    <button className={styles.button} onClick={() => setMode('top_gainers')}>Top gainers</button>
                    <button className={styles.button} onClick={() => setMode('top_loosers')}>Top loosers</button>
                    <button className={styles.button} onClick={() => setMode('newly_listed')}>Newly listed</button>
                </div>
            </div>
            {loading && 
                    <div className={styles.loading_wrapper}>
                        <div className={styles.loading_pills}></div>
                        <div className={styles.loading_pills}></div>
                        <div className={styles.loading_pills}></div>
                        <div className={styles.loading_pills}></div>
                        <div className={styles.loading_pills}></div>
                    </div>
            }
            {error && <p className={styles.error}>Error: {error.message}</p>}

            
            {/* Table header columns */}
            {!loading && !error &&
                <>
                    <div className={styles.top_colums_container}>
                        <div className={styles.column_container}><span>Asset</span></div>
                        <div className={styles.column_container}><span>Price</span></div>
                        <div className={styles.column_container}><span>24h price change</span></div>
                        <div className={styles.column_container}><span>24h cap change</span></div>
                        <div className={styles.column_container}><span>Volume</span></div>
                    </div> 
                    <div className={styles.rows_container}>
                        {/* Placeholder: display fetched data here */}
                            
                        {!loading && !error && data.length === 0 && (
                            <p>No data available for mode: {mode}</p>
                        )}
                        {!loading && !error && data.map((item, idx) => (
                            <div key={idx} className={styles.row}>
                                <div className={styles.row_asset_div}>
                                    <img className={styles.row_asset_img} src={item.image} />
                                    <div className={styles.row_asset_info}>
                                        <span>{item.name}</span>
                                        <span>{item.symbol}</span>
                                    </div>
                                </div>
                                <div className={styles.component_row}>{item.current_price}</div>
                                <div className={styles.component_row}>{item.price_change_percentage_24h}</div>
                                <div className={styles.component_row}>{item.market_cap_change_percentage_24h}</div>
                                <div className={styles.component_row}>{item.total_volume}</div>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    );
}

export default BasicInformation