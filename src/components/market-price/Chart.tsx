import { useEffect, useState } from 'react';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartProps {
  data: any; // TODO: 타입 정의 필요
  period: string;
}

export const Chart = ({ data, period }: ChartProps) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '판매가',
        data: [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: '구매가',
        data: [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '시세 그래프',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: '가격 (원)',
        },
      },
    },
  };

  useEffect(() => {
    if (data.success && data.data?.priceGraph?.dataPoints) {
      const dataPoints = data.data.priceGraph.dataPoints;

      // 기간에 따른 날짜 포맷 변경
      const formatLabel = (point: any) => {
        // TODO: 타입 정의 필요
        if (period === '1일') {
          // 시간 포맷 (HH:00)
          return `${point.date[3].toString().padStart(2, '0')}:00`;
        } else {
          // 날짜 포맷 (MM/DD)
          return `${point.date[1]}/${point.date[2]}`;
        }
      };

      setChartData({
        labels: dataPoints.map(formatLabel),
        datasets: [
          {
            label: '판매가',
            data: dataPoints.map((point: any) => point.registeredPrice), // TODO: 타입 정의 필요
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          },
          {
            label: '구매가',
            data: dataPoints.map((point: any) => point.soldPrice), // TODO: 타입 정의 필요
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
          },
        ],
      });
    }
  }, [data, period]); // data와 period가 변경될 때마다 실행

  return (
    <div className="aspect-video w-full rounded-lg bg-white p-4">
      <Line options={options} data={chartData} />
    </div>
  );
};
