
import React from 'react';
import { AreaHistoryData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaHistoryChartProps {
  data: AreaHistoryData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="font-bold">{`Tahun: ${label}`}</p>
        <p className="text-green-600">{`Luas: ${payload[0].value} Ha`}</p>
        <p className="text-sm text-gray-500 mt-1">{`Sumber: ${payload[0].payload.source}`}</p>
      </div>
    );
  }
  return null;
};

const AreaHistoryChart: React.FC<AreaHistoryChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col">
       <h3 className="text-lg font-semibold text-gray-700 mb-4">Perubahan Luas Situ Pamulang (2015-2024)</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit=" Ha" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="area" name="Luas (Hektar)" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaHistoryChart;
