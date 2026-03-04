import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const defaulters = [
  { student: 'Grace Njeri', admNo: 'CBC/2024/004', grade: 'PP2', balance: 16000, lastPaid: 'Never' },
  { student: 'David Ochieng', admNo: 'CBC/2024/003', grade: 'Grade3', balance: 10000, lastPaid: '2025-01-13' },
  { student: 'Faith Akinyi', admNo: 'CBC/2024/006', grade: 'Grade7', balance: 9000, lastPaid: '2025-01-11' },
  { student: 'John Kamau', admNo: 'CBC/2024/001', grade: 'Grade4', balance: 9000, lastPaid: '2025-01-15' },
];

interface DefaultersTabProps {
  // Add any props if needed
}

export default function DefaultersTab({}: DefaultersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Defaulters</CardTitle>
        <CardDescription>{defaulters.length} students with outstanding balances</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Adm No.</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaulters.map((d, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{d.student}</TableCell>
                <TableCell>{d.admNo}</TableCell>
                <TableCell>{d.grade}</TableCell>
                <TableCell className="font-bold text-red-600">KES {d.balance.toLocaleString()}</TableCell>
                <TableCell>{d.lastPaid}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">Send Reminder</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export { defaulters };

