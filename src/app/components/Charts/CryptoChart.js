'use client'
import styles from "./CryptoChart.module.css";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

import { useEffect, useState } from "react";
import { getCryptoHistory } from "../../services/cryptoService";
import {formatChartData} from "../../services/formatDate";


const CryptoChart = ({CryptoId, days}) => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCryptos = async () => {
          try {
            const data = await getCryptoHistory(CryptoId,'usd', days);
            const formattedData = formatChartData(data);
            const simpledData = formattedData.filter((_, i) => i % 5 === 0);
            setCryptos(simpledData);
          } catch (error) {
            setError('Failed to fetch crypto data.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCryptos();
    }, [CryptoId, days]);

    if (loading) return <div>Loading chart...</div>;
    
    return (
        <ResponsiveContainer width="50%" height={200}>
            <LineChart data={cryptos}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="price"
                stroke="#00ffae"
                strokeWidth={2}
                strokeDasharray="3 4"
                activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
                dot={{ r: 3, stroke: '#00ffae', strokeWidth: 1, fill: '#ffffff' }}
            />
            </LineChart>
      </ResponsiveContainer>
    );
};

export default CryptoChart;