'use client'

import styles from "./NavBar.module.css";

import { useState, useEffect, useMemo} from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { fetchUserData } from "@/app/services/fetchUserData";

import { IoMdDownload } from "react-icons/io";
import { MdAccountBalanceWallet } from "react-icons/md";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { LuMoonStar, LuSunMedium } from "react-icons/lu";
import { RxAvatar } from "react-icons/rx";

import { useDepositStorage } from "@/app/Utils/useDepositStorage";
import {LocalStorage} from "../../Utils/LocalStorage";
import detectDarkMode from '../../Utils/detectDarkMode';

import Deposit from "../Deposit/Deposit";

import Link from "next/link";


const NavBar = (props) => {
    const [userData, setUserData] = useState(null);

    const [isDarkMode, setIsDarkMode] = LocalStorage('darkMode', detectDarkMode());

    const { toggleDeposit, showDeposit } = useDepositStorage();

    useEffect(() => {
        if (isDarkMode === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        window.dispatchEvent(new Event("darkModeChanged"));
    }, [isDarkMode]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event) => {
            const newColorScheme = event.matches ? 'dark' : 'light';
            setIsDarkMode(newColorScheme);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [setIsDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((currentValue) => {
            return currentValue === 'light' ? 'dark' : 'light';
        });
    };


    const auth = getAuth();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
    if (!loading && user) {
        fetchUserData(user.uid).then((data) => {
        setUserData(data);
        });
    }
    }, [user, loading]);

    const displayName = useMemo (() => userData?.displayName || 'User');
    const isPremium = useMemo (() => userData?.isPremium ?? false);
    const balance = useMemo (() => userData?.balance ?? '...');

    return (
        <>
            {showDeposit && <Deposit onClose={toggleDeposit} />}
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.nav_row}>
                        <span className={styles.logo} aria-label="Logo"><strong>Jobdiko</strong></span>
                        <ul className={styles.nav__list}>
                            <li className={styles.nav__item}>
                                <Link href="/dashboard" className={`${styles.nav__link} ${props.activePage === 'dashboard' ? styles.active : ''}`} aria-label="Home">Home</Link>
                            </li>
                            <li className={styles.nav__item} >
                                <Link href="/trade" className={`${styles.nav__link} ${props.activePage === 'trade' ? styles.active : ''}`} aria-label="Trade">Trade</Link>
                            </li>
                            <li className={styles.nav__item}>
                                <Link href="/portfolio" className={`${styles.nav__link} ${props.activePage === 'portfolio' ? styles.active : ''}`} aria-label="Portfolio">Portfolio</Link>
                            </li>
                            <li className={styles.nav__item}>
                                <Link href="/contact" className={`${styles.nav__link} ${props.activePage === 'contact' ? styles.active : ''}`} aria-label="Contact">Contact</Link>
                            </li>
                        </ul>

                        <div className={styles.nav__block}>
                        
                            <button className={styles.btn_deposit} aria-label="Deposit" onClick={toggleDeposit}> <IoMdDownload className={styles.icon_deposit} /> Deposit</button>
                            <div className={styles.balance_div} aria-label="User balance">
                                <div className={styles.balance_logo}>
                                    <MdAccountBalanceWallet className={styles.icon_balance} />
                                </div>
                                {userData &&
                                    <div className={styles.balance}>
                                        <span className={styles.balance_span}>{balance} USD</span>
                                    </div>
                                }
                            </div>
                            <button className={styles.btn_circle}> <HiOutlineBellAlert className={styles.icon_alerts} /></button>
                            <button className={`${styles.btn_changeTheme} ${styles.btn_circle} ${isDarkMode === 'dark' ? styles.active : ''}`} onClick={toggleDarkMode} aria-label="Toggle dark mode">
                                <LuMoonStar className={styles.icon_changeTheme} style={{ transform: isDarkMode === 'dark' ? "" : "translatey(-150%)"}} />
                                <LuSunMedium className={styles.icon_changeTheme} style={{ transform: isDarkMode === 'dark' ? "translatey(-150%)" : ""}}/>
                            </button>
                            <div className={styles.account_div}>
                                <div className={styles.account_avatar_div}>
                                    <RxAvatar className={styles.icon_avatar} aria-label="User account"/>
                                </div>
                                {userData &&
                                    <div className={styles.account_text_div}>
                                        <span className={styles.account_name}>{displayName}</span>
                                        <div className={styles.account_status_div}>
                                            <span className={styles.account_status}>{isPremium ? 'Premium' : 'Free'}</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar