import styles from "./PortfolioChartBlock.module.css";

import { IoMdDownload } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { GrTransaction } from "react-icons/gr";

import { useEffect, useMemo, useState } from "react";
import { getFirestore, getDocs,collection } from "firebase/firestore";
import { useDepositStorage } from "@/app/Utils/useDepositStorage";
import { getCtyptoPrices } from "@/app/services/API/cryptoService";
import { calculateLiveProfit, calculateProfitLast9 } from "@/app/services/logic/calculateProfit";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Defs, LinearGradient, Stop , ReferenceLine} from 'recharts';


// PortfolioChartBlock component: fetches user wallet data, calculates profits, and renders a bar chart
const PortfolioChartBlock = (uid) => { 
    // Custom hook for showing/hiding deposit modal
    const { toggleDeposit, showDeposit } = useDepositStorage();

    // State to hold total portfolio metrics and historical profit data
    const [currentProfit, setCurrentProfit] = useState(0);
    const [profitLast9, setProfitLast9] = useState([]);

    const db = getFirestore();

    // Fetch portfolio data on mount or when uid changes
    useEffect(() => {
        const fetchPortfolio = async () => {
          if (!uid) return;
          try{
            // Retrieve wallet transactions collection for the user
            const snapshot = await getDocs(collection(db, "users", uid.uid, "wallet"));
            const txs = snapshot.docs.map(doc => doc.data());
            
            // Extract unique symbols from transactions
            const uniqueSymbols = [...new Set(txs.map(tx => tx.symbol.toLowerCase()))];
            const currentPrices = await getCtyptoPrices(uniqueSymbols.map(uniqueSymbols => uniqueSymbols));
            
            // Calculate portfolio metrics
            const current = await calculateLiveProfit(uid.uid, currentPrices);
            const profitLast9 = await calculateProfitLast9(uid.uid, current);
            setCurrentProfit(current);
            setProfitLast9(profitLast9);
              
          }
          catch(err){
            console.log("Failed to fatch promise",err);
          }
        };
        fetchPortfolio();
    }, [uid]); // Re-run when user ID or db instance changes



    return (
        <div className={styles.portfolio_value_div}>
          {/* Top block: current values and action buttons */}
          <div className={styles.top_block}>
            <div className={styles.portfolio_value}>
              <span className={styles.portfolio_value_title}>
                Portfolio Value
              </span>
              <span className={styles.portfolio_value_currency}>
                {currentProfit.totalValue} <span className={styles.portfiolio_value_currency_symbol}>USD</span>
              </span>
              <span className={styles.portfolio_value_amount}>
                {currentProfit.profit} USD in the last year
              </span>
            </div>

             {/* Action buttons: Deposit, Withdraw, Earns */}
            <div className={styles.portfolio_buttons}>
              <button
                className={styles.portfolio__button}
                onClick={toggleDeposit}
              >
                {" "}
                <IoMdDownload className={styles.portfolio__button_icon} />
                Deposit
              </button>
              <button className={styles.portfolio__button}>
                <LuUpload className={styles.portfolio__button_icon} />
                Withdraw
              </button>
              <button className={styles.portfolio__button}>
                <GrTransaction className={styles.portfolio__button_icon} />
                Earns
              </button>
            </div>
          </div>
          {/* Chart block: renders profit history as a bar chart */}
          <div className={styles.portfolio_chart_div}>
            <ResponsiveContainer width="100%" height="98%">
              <BarChart
                data={profitLast9}
                barCategoryGap="2%"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  {/* Define a vertical gradient for the bars */}
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#11C9C3" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0D9A96" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--gray-text)" axisLine={false} tickLine={false}/> 
                <YAxis stroke="var(--gray-text)" axisLine={false} tickLine={false}/>
                {/* Tooltip with custom formatting and styles */}
                <Tooltip cursor={{ fill: "transparent" }}
                  contentStyle={{
                    background: 'var(--container)',       
                    border: 'none',
                    borderRadius: 10,
                    color: 'var(--text)',         
                  }}
                  itemStyle={{ color: 'var(--accent)' }} 
                  formatter={(value) => [`${value.toLocaleString()} $`, 'Profit']} 
                />
                <ReferenceLine y={0} stroke="#000" />
                {/* Bars with gradient fill and rounded top corners */}
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={150}
                  activeBar = {{
                    fill: "url(#barGradient)",
                    background: "#000000"
                  }}
                
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    );
};

export default PortfolioChartBlock;