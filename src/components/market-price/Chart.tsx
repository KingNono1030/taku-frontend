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

import { MarketPriceSearchResponse } from '@/types/market-price-type/marketPrice.types';

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
  data: MarketPriceSearchResponse;
  startDate: Date;
  endDate: Date;
}

interface ChartDataset {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export const Chart = ({ data, startDate, endDate }: ChartProps) => {
  const [chartData, setChartData] = useState<ChartDataset>({
    labels: [],
    datasets: [
      {
        label: '판매가',
        data: [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: '등록가',
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
      x: {
        title: {
          display: true,
          text: `${startDate.toLocaleDateString()} ~ ${endDate.toLocaleDateString()}`,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
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
    if (data?.success && data.data?.priceGraph?.dataPoints) {
      const dataPoints = data.data.priceGraph.dataPoints;

      // 선택된 날짜 범위 내의 데이터만 필터링
      const filteredDataPoints = dataPoints.filter((point) => {
        if (!point.date) return false;
        const pointDate = new Date(point.date);
        return pointDate >= startDate && pointDate <= endDate;
      });

      const formatLabel = (point: { date?: string }) => {
        if (!point.date) return '';
        const date = new Date(point.date);
        return date.toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
        });
      };

      setChartData({
        labels: filteredDataPoints.map(formatLabel),
        datasets: [
          {
            label: '판매가',
            data: filteredDataPoints.map((point) => point.registeredPrice ?? 0),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          },
          {
            label: '등록가',
            data: filteredDataPoints.map((point) => point.soldPrice ?? 0),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
          },
        ],
      });
    }
  }, [data, startDate, endDate]);

  // 데이터가 없는 경우 처리
  if (!data?.success || !data.data?.priceGraph?.dataPoints) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-white p-4">
        <p className="text-muted-foreground">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-lg bg-white p-4">
      <Line options={options} data={chartData} />
    </div>
  );
};
