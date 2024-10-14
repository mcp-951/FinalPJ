import Footer from 'component/util/Footer';
import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';
import '../../../resource/css/assets/AssetsAnalysis.css';

const AssetsAnalysis = () => {
  // 임시 데이터
  const data = [
    { month: '1월', type: 'spending', amount: 1000 },
    { month: '2월', type: 'spending', amount: 1200 },
    { month: '3월', type: 'spending', amount: 900 },
    { month: '4월', type: 'spending', amount: 1400 },
    { month: '1월', type: 'saving', amount: 100 },
    { month: '2월', type: 'saving', amount: 150 },
    { month: '3월', type: 'saving', amount: 50 },
    { month: '4월', type: 'saving', amount: 70 },
  ];

  const [selectedType, setSelectedType] = useState('');

  // 선택된 자산 유형에 따른 데이터 필터링
  const filteredData = selectedType
    ? data.filter(asset => asset.type === selectedType)
    : data;

  // 총 저축 금액 계산
  const totalSavingAmount = data
    .filter(asset => asset.type === 'saving')
    .reduce((sum, item) => sum + item.amount, 0);

  // 그래프 데이터 형식으로 변환
  const chartData = [
    ['Month', 'Spending Money', '저축금액'], // 'Saving Money'를 '저축금액'으로 변경
    ...data.reduce((acc, item) => {
      const index = acc.findIndex(row => row[0] === item.month);
      if (index >= 0) {
        acc[index][item.type === 'spending' ? 1 : 2] = item.amount;
      } else {
        acc.push([item.month, item.type === 'spending' ? item.amount : 0, item.type === 'saving' ? item.amount : 0]);
      }
      return acc;
    }, []),
  ];

  const filteredChartData = [
    ['Month', selectedType === 'spending' ? 'Spending Money' : 'Saving Money'],
    ...filteredData.map(item => [item.month, item.amount]),
  ];

  const options = {
    title: selectedType === 'saving' ? '저축금액 차트' : '자산 흐름 차트',
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: { title: 'Month' },
    vAxis: { title: 'Amount (만원)', format: 'short' },
    series: {
      0: { color: selectedType === 'saving' ? 'red' : 'blue', labelInLegend: selectedType === 'saving' ? '저축금액' : '가용금액' },
    },
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // 현재 사용 가능한 돈 또는 총 저축 금액 계산
  const latestData = filteredData[filteredData.length - 1];
  const currentAmount = latestData ? latestData.amount : 0;

  return (
    <div>
      <div className="assets-analysis-container">
        <select className="select-box" onChange={handleTypeChange} value={selectedType}>
          <option value="">자산 유형 선택</option>
          <option value="spending">쓸수 있는돈</option>
          <option value="saving">모으고 있는돈</option>
        </select>
        <div className="chart-container">
          <div className="chart">
            <Chart
              chartType="LineChart"
              width="110%" // width increased by 10%
              height="100%"
              data={selectedType ? filteredChartData : chartData}
              options={options}
            />
          </div>
          <div className="ment">
            {selectedType === 'spending'
              ? `현재 사용 가능한 돈은 ${currentAmount}만원입니다.`
              : selectedType === 'saving'
              ? `현재까지 총 ${totalSavingAmount}만원 저축했습니다.`
              : '자산 유형을 선택하세요.'}
          </div>
        </div>
      </div>
      <div className="footer-container">
        <Link to="/asset-calendar">
          <button>뒤로</button>
        </Link>
        <Footer/>
      </div>
    </div>
  );
};

export default AssetsAnalysis;
