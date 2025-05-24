'use client'
import styles from "./dashboardPage.module.css";

import { useEffect, useState } from "react";

import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import NavBar from "../components/Navbar/NavBar";
import PortfolioChartBlock from "../components/Charts/PortfolioChartBlock/PortfolioChartBlock";
import BasicInformation from "../components/Containers/BasicInformation/BasicInformation";

// DashboardPage: main page displaying navbar, portfolio chart, and general info widgets
const DashboardPage = () => {
  // Set the active page prop for NavBar highlighting
  const activePage = "dashboard";

  // Initialize Firebase auth and track user login state
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  
  return (
    <>
      {/* Navigation bar with 'dashboard' highlighted */}
      <NavBar activePage={activePage} />
      {/* Main top container wrapping chart and info widgets */}
      <div className={styles.top_container}>

         {/* Portfolio chart block: fetches and displays user's portfolio performance */}
        <PortfolioChartBlock uid={user.uid}></PortfolioChartBlock>

         {/* General info section: placeholder divs for spot price, total earnings, profit, and NFTs */}
        <div className={styles.general_info_div}>
          <div className={styles.spot_div}></div>

          <div className={styles.total_earn_div}></div>

          <div className={styles.total_profit_div}></div>

          <div className={styles.nft_div}></div>
        </div>
      </div>

      <div className={styles.bottom_left_container}>
        <BasicInformation uid={user.uid}/>
      </div>
      
    </>
  );
};

export default DashboardPage;