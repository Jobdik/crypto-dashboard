import styles from "./BasicInformation.module.css";

import { useEffect, useState } from "react";


// BasicInformation component: displays asset overview with filtering modes and loading/error handling
const BasicInformation = () => {
    // State for fetched data (favorites, top traders, gainers, etc.)
    const [data, setData] = useState([]);
    // Mode controls which dataset to fetch/display
    const [mode, setMode] = useState('favorites');
    // Loading indicator state
    const [loading, setLoading] = useState(true);
    // Error state for fetch failures
    const [error, setError] = useState(null);

    // Effect to fetch data whenever 'mode' changes
    useEffect(() => {
        setLoading(true);
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
                    <button className={styles.button}>Favourite</button>
                    <button className={styles.button}>Top Tradet</button>
                    <button className={styles.button}>Top gainers</button>
                    <button className={styles.button}>Top loosers</button>
                    <button className={styles.button}>Newly listed</button>
                </div>
            </div>

            {/* Table header columns */}
            <div className={styles.top_colums_container}>
                <div><span>Asset</span></div>
                <div><span>Price</span></div>
                <div><span>24h trend</span></div>
                <div><span>24h change</span></div>
                <div><span>Volume</span></div>
            </div> 

            <div className={styles.rows_container}>
                {/* Placeholder: display fetched data here */}
                {loading && <p>Loading...</p>}
                {error && <p className={styles.error}>Error: {error.message}</p>}
                {!loading && !error && data.length === 0 && (
                    <p>No data available for mode: {mode}</p>
                )}
                {!loading && !error && data.map((item, idx) => (
                    <div key={idx} className={styles.row}>
                        <div>{item.asset}</div>
                        <div>{item.price}</div>
                        <div>{item.trend24h}</div>
                        <div>{item.change24h}</div>
                        <div>{item.volume}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BasicInformation