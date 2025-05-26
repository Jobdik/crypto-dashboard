import styles from "./BasicInformation.module.css";

import {useEffect, useState } from "react";

import useCryptoData from "@/app/hooks/useCryptoData";
import ToggleFavorite from "@/app/components/Favorite/ToggleFavorite";

// BasicInformation component: displays asset overview with filtering modes and loading/error handling
const BasicInformation = ({uid}) => {
    // Mode controls which dataset to fetch/display
    const [mode, setMode] = useState('top_gainers');

    const { data, loading, error } = useCryptoData({ mode, uid });

    const [rowsToShow, setRowsToShow] = useState(4);

    useEffect(() => {
        setRowsToShow(4);
    }, [mode]);

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
                    <button className={styles.button} onClick={() => setMode('top_losers')}>Top loosers</button>
                    <button className={styles.button} onClick={() => setMode('new_listings')}>Newly listed</button>
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
            {error && <p className={styles.error}>{error.message}</p>}

            
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
                            
                            visibleData.map((item) => ( 
                               <tr key={item.id} className={styles.row}>
                                    <td ><div className={styles.row_asset_div}>
                                        <img src={item.image} alt={item.name} className={styles.row_asset_img} />
                                        <div className={styles.row_asset_info}>
                                            <span>{item.name}</span>
                                            <span>{item.symbol}</span>
                                        </div>    
                                    </div></td>
                                    <td>{item.current_price} $</td>
                                    <td>{item.price_change_percentage_24h} %</td>
                                    <td>{item.market_cap_change_percentage_24h} %</td>
                                    <td className={styles.row_volume}>
                                        <div className={styles.row_volume_wrapper}>
                                           {item.total_volume}
                                           {mode === 'favorites' && 
                                                <ToggleFavorite item_id={item.id}/>
                                           }
                                        </div>
                                    </td>
                                </tr> 
                            ))
                        )}
                       
                    </tbody>
                </table>

                {/* Show more button */}
                {!loading && !error && data.length !== 0 &&  (
                    <div className={styles.show_more_container}>
                        <button className={styles.show_more_button} onClick={() => setRowsToShow(prev => prev === 4 ? data.length : 4)}>
                            {rowsToShow === 4 ? 'Show more' : ' Show less'}
                        </button>
                    </div>
                )}
            </>)}
        </div>
    );
}

export default BasicInformation