
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface HealthChartProps {
  data: { date: string; value: number }[];
  dataKey: string;
  name: string;
}

export function HealthChart({ data, dataKey, name }: HealthChartProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    name={name}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
