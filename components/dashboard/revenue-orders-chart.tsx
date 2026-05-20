'use client';

import { Bar, BarChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatIDR } from '@/lib/currency';

type RevenueOrdersPoint = {
  key: string;
  label: string;
  orders: number;
  revenue: number;
};

type RevenueOrdersChartProps = {
  data: RevenueOrdersPoint[];
};

export default function RevenueOrdersChart({ data }: RevenueOrdersChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#d9e6da" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#617063' }} tickLine={false} axisLine={{ stroke: '#d9e6da' }} />
          <YAxis
            yAxisId="left"
            tickFormatter={(value: number) => formatIDR(value).replace(',00', '')}
            tick={{ fontSize: 12, fill: '#617063' }}
            tickLine={false}
            axisLine={{ stroke: '#d9e6da' }}
            width={86}
          />
          <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 12, fill: '#617063' }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value, name) => {
              const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
              return name === 'Pendapatan' ? formatIDR(numericValue) : numericValue;
            }}
            labelFormatter={(label) => `Tanggal: ${label}`}
            contentStyle={{ borderRadius: 12, borderColor: '#d9e6da' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="revenue" name="Pendapatan" fill="#346739" radius={[8, 8, 0, 0]} maxBarSize={36} />
          <Line yAxisId="right" type="monotone" dataKey="orders" name="Jumlah Order" stroke="#2f80ed" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
