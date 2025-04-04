import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#6F42C1', '#FF5B5B', '#FFCB45', '#D9D9D9'];
const ICONS = ['🟣', '🔴', '🟡', '⚪️'];

interface DonutChartWithLegendsProps {
  data: any[];
  valueKey: string;
  nameKey: string;
  lastMonthData?: any[];
}

const DonutChartWithLegends: React.FC<DonutChartWithLegendsProps> = ({ data, valueKey, nameKey, lastMonthData = [] }) => {
  const totalValue = data.reduce((sum, entry) => sum + Number(entry[valueKey]), 0);
  const lastMonthTotal = lastMonthData.reduce((sum, entry) => sum + Number(entry[valueKey]), 0);
  const percentageChange = lastMonthTotal
    ? (((totalValue - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
    : '0.0';
  const trendIsUp = Number(percentageChange) >= 0;

  const chartData = data.map((item, index) => ({
    name: item[nameKey],
    value: Number(item[valueKey]),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="w-full flex flex-col gap-4 p-4 items-center">

      {/* Donut and legend in a column */}
      <div className="flex flex-col items-center w-full">
        {/* Half Donut Chart */}
        <div className="relative w-[260px] h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="70%"
                innerRadius={75}
                outerRadius={90}
                startAngle={180}
                endAngle={0}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Donut Text */}
          <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-lg">₹{(totalValue / 100000).toFixed(1)}L</p>
            <p className={`text-xs ${trendIsUp ? 'text-green-500' : 'text-red-500'}`}>
              {trendIsUp ? '↑' : '↓'} {Math.abs(Number(percentageChange)).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Legend Side */}
        <div className="flex flex-col gap-3 w-full pt-1">
          {chartData.map((entry, index) => {
            const percent = ((entry.value / totalValue) * 100).toFixed(0);
            const trendUp = index % 2 === 0; // Placeholder trend logic
            return (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <span>{ICONS[index % ICONS.length]}</span>
                  <span className="font-medium text-sm">{entry.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">₹{(entry.value / 100000).toFixed(1)}L</span>
                  <span className="text-gray-400">{percent}%</span>
                  <span className={trendUp ? 'text-green-500' : 'text-red-500'}>
                    {trendUp ? '↑ 1.2%' : '↓ 3.3%'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChartWithLegends;
