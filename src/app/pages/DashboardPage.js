'use client'
import styles from "./DashboardPage.module.css";

import { useEffect, useState } from "react";

import { getCryptos } from "../services/cryptoService";
import CryptoChart from "../components/Charts/CryptoChart";


const DashboardPage = () => { 
    const [coins, setCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState('bitcoin');
    const [days, setDays] = useState(30);

    useEffect(() => {
        getCryptos('usd', 20)
        .then(data => setCoins(data))
        .catch(console.error);
    }, []);
    return (
        <div>
      <h1>Crypto Dashboard</h1>

      <label>
        Choose coin:&nbsp;
        <select value={selectedCoin} onChange={e => setSelectedCoin(e.target.value)}>
          {coins.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: 20 }}>
        Period:&nbsp;
        <select value={days} onChange={e => setDays(Number(e.target.value))}>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={365}>1 year</option>
        </select>
      </label>

      <div style={{ marginTop: 30 }}>
        <CryptoChart CryptoId={selectedCoin} days={days}/>
      </div>
    </div>
  );
}
 
export default DashboardPage;