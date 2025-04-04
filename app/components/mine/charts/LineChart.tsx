import React, { FC } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: any[];
  valueKey: string;
  datasetLabel: string;
  noDot?: boolean;
  yAxisFormat?: (val: number) => string;
  xAxisFormat?: (label: string) => string;
  xTickInterval?: number;
}

const LineChart: FC<LineChartProps> = ({ data, valueKey, datasetLabel, noDot = false, yAxisFormat, xAxisFormat, xTickInterval }) => {
  const labels = data.map((item: any) => 
    xAxisFormat ? xAxisFormat(item["blinkit_insights_sku.created_at"]) : item["blinkit_insights_sku.created_at"]
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: data.map((item: any) => Number(item[valueKey])),
        borderWidth: 2,
        borderColor: '#ffcccb',
        backgroundColor: '#9BD0F5',
        fill: 'origin', // Explicitly fill from the line to the origin
        pointRadius: noDot ? 0 : 3,
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: false,
          text: 'Day of Month',
        },
        ticks: {
          callback: function(value: any, index: number) {
            if (xTickInterval && index % xTickInterval !== 0) return '';
            return labels[index];
          }
        }
      },
      y: {
        title: {
          display: false,
          text: datasetLabel,
        },
        ticks: {
          callback: function(val: string | number) {
            const v = Number(val);
            return yAxisFormat ? yAxisFormat(v) : v;
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return `${datasetLabel}: ${value}`;
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
