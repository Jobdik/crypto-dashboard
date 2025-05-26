import {useState , useEffect} from 'react';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from "./ToggleFavorite.module.css";



const ToggleFavorite = (item_id) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return(
        <div className={styles.button_favorite_div}>
            <button className={styles.button_favorite} onClick={() => {toggleFavorite()}}>{isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}</button>
        </div>
    )
};

export default ToggleFavorite