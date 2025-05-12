'use client'
import styles from "./dashboardPage.module.css";

import { useEffect, useState } from "react";

import { getCryptos } from "../services/cryptoService";

import { IoMdDownload } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { MdAccountBalanceWallet } from "react-icons/md";

import { useDepositStorage } from "@/app/Utils/useDepositStorage";

import CryptoChart from "../components/Charts/CryptoChart";

import NavBar from "../components/Navbar/NavBar";


const DashboardPage = () => { 
    const [coins, setCoins] = useState([]);

    const { toggleDeposit, showDeposit } = useDepositStorage();

    const activePage = 'dashboard';

    useEffect(() => {
        getCryptos('usd', 20)
        .then(data => setCoins(data))
        .catch(console.error);
    }, []);
    return (
    <>
      <NavBar activePage={activePage}/>
      <div className={styles.top_container}>
        <div className={styles.portfolio_value_div}>
          <div className={styles.top_block}>
              <div className={styles.portfolio_value}>
                <span className={styles.portfolio_value_title}>Portfolio Value</span>
                <span className={styles.portfolio_value_currency}>USD</span>
                <span className={styles.portfolio_value_amount}>USD in the last year</span>
              </div>

              <div className={styles.portfolio_buttons}>
                  <button className={styles.portfolio__button} onClick={toggleDeposit}> <IoMdDownload className={styles.portfolio__button_icon}/>Deposit</button>
                  <button className={styles.portfolio__button}><LuUpload className={styles.portfolio__button_icon}/>Withdraw</button>
                  <button className={styles.portfolio__button}><MdAccountBalanceWallet className={styles.portfolio__button_icon}/>Portfolio</button>
              </div>
          </div>
          <div className={styles.portfolio_chart_div}>

          </div>
        </div>

        <div className={styles.general_info_div}>
            <div className={styles.spot_div}>

            </div>

            <div className={styles.total_earn_div}>

            </div>

            <div className={styles.total_profit_div}>

            </div>

            <div className={styles.nft_div}>

            </div>
        </div>
      </div>
    </>
  );
}
 
export default DashboardPage;