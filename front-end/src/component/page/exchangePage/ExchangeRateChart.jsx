import React from 'react';
import { Line } from 'react-chartjs-2';
import '../../../resource/css/exchange/ExchangeRateChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ExchangeRateChart({ exchangeRates }) {
  // exchangeRates가 비어 있을 경우에 대한 기본 처리
  const chartData = {
    labels: ['USD', 'JPY', 'CNY', 'GBP', 'EUR'],
    datasets: [
      {
        label: '환율 (원)',
        data: exchangeRates && exchangeRates.length > 0
          ? exchangeRates.map(rate => rate.deal_bas_r)
          : [0, 0, 0, 0, 0], // 데이터가 없을 때 기본 값
        borderColor: '#74a1d2',
        backgroundColor: 'rgba(116, 161, 210, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="ExchangeRateChart-container">
      <h3 className="ExchangeRateChart-title">실시간 환율</h3>
      <div className="ExchangeRateChart-wrapper">
        <Line 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 100,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default ExchangeRateChart;
