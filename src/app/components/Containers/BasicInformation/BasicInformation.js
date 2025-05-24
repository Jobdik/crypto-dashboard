import styles from "./BasicInformation.module.css";

import { useEffect, useState, useCallback } from "react";

import {getCryptoFavorite, getCryptoTopGainersLosers, getCryptoNewListings} from "@/app/services/API/cryptoService";

import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaViacoin } from "react-icons/fa";


// BasicInformation component: displays asset overview with filtering modes and loading/error handling
const BasicInformation = (uid) => {
    // State for fetched data (favorites, top traders, gainers, etc.)
    const [data, setData] = useState([]);
    // Mode controls which dataset to fetch/display
    const [mode, setMode] = useState('');
    // Loading indicator state
    const [loading, setLoading] = useState(false);
    // Error state for fetch failures
    const [error, setError] = useState(null);

    const [favorite, setFavorite] = useState([]);

    const [rowsToShow, setRowsToShow] = useState(4);

    // Effect to fetch data whenever 'mode' changes
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let result = [];
            switch(mode){
                case 'favorites':
                    result = await getCryptoFavorite(uid) || [];
                    break;
                case 'top_tradet':
                    break;
                case 'top_gainers':
                    result = await getCryptoTopGainersLosers() || [];
                    break;
                case 'top_loosers':
                    result = await getCryptoTopGainersLosers() || [];
                    break;
                case 'new_listings':
                    result = await getCryptoNewListings() || [];
                    break;
                default:
                    result = [];
                    break;
            }
           setData(result);
        
        }   
        catch (error) {
            setError('Failed to fetch crypto data:' + error);
        } 
        finally {
            setLoading(false);
            setRowsToShow(4);
        }
    }, [mode, uid]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    

    const toggleFavorite = (id) => {
       setData((prevData) => prevData.map((item) => item.id === id ? {...item, Favorite: !item.Favorite} : item));
    };

    // Slice the data to show only the specified number of rows
    const visibleData = data.slice(0, rowsToShow);
    
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
            {/* Loading indicator */}
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
            {!loading && !error && (<>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.table_header}>
                            <th>Asset</th>
                            <th>Price</th>
                            <th>24h price change</th>
                            <th>24h cap change</th>
                            <th>Volume</th>
                        </tr>
                    </thead>

                    {/* Table body rows */}
                    <tbody className={styles.table_body}>
                        {/* if there are no data, show a fallback message */}
                        {/* if there are data, show the rows */}
                        { visibleData.length === 0 ? (
                            <tr className={styles.row}>
                                <td colSpan="5" className={styles.no_data}>No data available</td>
                            </tr>
                        ):(
                            
                            visibleData.map((item, idx) => ( 
                               <tr key={idx} className={styles.row}>
                                    <td ><div className={styles.row_asset_div}>
                                        <img src={item.image} alt={item.name} className={styles.row_asset_img} />
                                        <div className={styles.row_asset_info}>
                                            <span>{item.name}</span>
                                            <span>{item.symbol}</span>
                                        </div>    
                                    </div></td>
                                    <td>{item.current_price}</td>
                                    <td>{item.price_change_percentage_24h} %</td>
                                    <td>{item.market_cap_change_percentage_24h} %</td>
                                    <td className={styles.row_volume}>
                                        <div className={styles.row_volume_wrapper}>
                                           {item.total_volume}
                                           {mode === 'favorites' && 
                                                <div className={styles.row_volume_button}>
                                                    <button className={styles.row_button_favorite} onClick={() => {toggleFavorite(item.id)}}>{item.favorite ? <MdFavorite /> : <MdFavoriteBorder />}</button>
                                                </div>
                                           }
                                        </div>
                                    </td>
                                </tr> 
                            ))
                        )}
                       
                    </tbody>
                </table>

                {/* Show more button */}
                {!loading && !error && data.length !== 0 && rowsToShow < data.length  (
                    <div className={styles.show_more_container}>
                        <button className={styles.show_more_button} onClick={rowsToShow > 4 ? () => setRowsToShow(rowsToShow + 6) : () => setRowsToShow(rowsToShow-6)}>Show More</button>
                    </div>
                )}
            </>)}
        </div>
    );
}

export default BasicInformation