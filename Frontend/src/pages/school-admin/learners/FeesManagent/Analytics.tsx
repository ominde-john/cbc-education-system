import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const collectionByGrade = [
  { grade: 'PP1', collected: 80, target: 100 },
  { grade: 'PP2', collected: 50, target: 100 },
  { grade: 'G1-G3', collected: 70, target: 100 },
  { grade: 'G4-G6', collected: 85, target: 100 },
  { grade: 'G7-G9', collected: 90, target: 100 },
];

const paymentMethodData = [
  { name: 'M-Pesa', value: 45, color: '#22c55e' },
  { name: 'Bank', value: 30, color: '#3b82f6' },
  { name: 'Cash', value: 15, color: '#f59e0b' },
  { name: 'Card', value: 10, color: '#8b5cf6' },
];

interface AnalyticsTabProps {
  // Add any props if needed
}

export default function AnalyticsTab({}: AnalyticsTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Collection Rate by Grade Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collectionByGrade.map(g => (
              <div key={g.grade}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{g.grade}</span>
                  <span>{g.collected}%</span>
                </div>
                <Progress value={g.collected} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={paymentMethodData} 
                cx="50%" 
                cy="50%" 
                innerRadius={50} 
                outerRadius={90} 
                dataKey="value" 
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {paymentMethodData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export { collectionByGrade, paymentMethodData };

