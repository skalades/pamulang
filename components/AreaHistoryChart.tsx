import React from 'react';
import { AreaHistoryData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaHistoryChartProps {
  data: AreaHistoryData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface dark:bg-dark-surface p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold text-on-surface dark:text-dark-on-surface">{`Tahun: ${label}`}</p>
        <p className="text-primary dark:text-dark-primary">{`Luas: ${payload[0].value} Ha`}</p>
        <p className="text-sm text-on-surface-muted dark:text-dark-on-surface-muted mt-1">{`Sumber: ${payload[0].payload.source}`}</p>
      </div>
    );
  }
  return null;
};

const AreaHistoryChart: React.FC<AreaHistoryChartProps> = ({ data }) => {
  return (
    <div className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-lg h-full flex flex-col border border-gray-200 dark:border-gray-700">
       <h3 className="text-lg font-semibold text-on-surface dark:text-dark-on-surface mb-4">Perubahan Luas Situ Pamulang (2015-2024)</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00796b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00796b" stopOpacity={0.4}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="year" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis unit=" Ha" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(113, 128, 150, 0.1)'}}/>
            <Legend />
            <Bar dataKey="area" name="Luas (Hektar)" fill="url(#colorUv)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaHistoryChart;