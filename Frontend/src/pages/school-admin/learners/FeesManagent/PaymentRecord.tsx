import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Search, CreditCard, Smartphone, Building2, Banknote } from 'lucide-react';

const mockPayments = [
  { id: '1', student: 'John Kamau', admNo: 'CBC/2024/001', grade: 'Grade4', amount: 15000, method: 'M-Pesa', receipt: 'RCP-2025-001', date: '2025-01-15', term: 'Term1', balance: 9000 },
  { id: '2', student: 'Jane Wanjiku', admNo: 'CBC/2024/002', grade: 'Grade5', amount: 24000, method: 'Bank', receipt: 'RCP-2025-002', date: '2025-01-14', term: 'Term1', balance: 0 },
  { id: '3', student: 'David Ochieng', admNo: 'CBC/2024/003', grade: 'Grade3', amount: 10000, method: 'Cash', receipt: 'RCP-2025-003', date: '2025-01-13', term: 'Term1', balance: 10000 },
  { id: '4', student: 'Brian Mwangi', admNo: 'CBC/2024/005', grade: 'Grade6', amount: 26500, method: 'M-Pesa', receipt: 'RCP-2025-004', date: '2025-01-12', term: 'Term1', balance: 0 },
  { id: '5', student: 'Faith Akinyi', admNo: 'CBC/2024/006', grade: 'Grade7', amount: 20000, method: 'Card', receipt: 'RCP-2025-005', date: '2025-01-11', term: 'Term1', balance: 9000 },
  { id: '6', student: 'Kevin Kipchoge', admNo: 'CBC/2024/007', grade: 'Grade8', amount: 33000, method: 'Bank', receipt: 'RCP-2025-006', date: '2025-01-10', term: 'Term1', balance: 0 },
];

const methodIcons: Record<string, React.ReactNode> = {
  'M-Pesa': <Smartphone className="h-4 w-4" />,
  'Bank': <Building2 className="h-4 w-4" />,
  'Cash': <Banknote className="h-4 w-4" />,
  'Card': <CreditCard className="h-4 w-4" />,
};

export default function PaymentsTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = mockPayments.filter(p =>
    p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.admNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Payments</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-9" 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.receipt}</TableCell>
                <TableCell>
                  {p.student}<br />
                  <span className="text-xs text-muted-foreground">{p.admNo}</span>
                </TableCell>
                <TableCell>{p.grade}</TableCell>
                <TableCell className="font-medium text-green-600">KES {p.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {methodIcons[p.method]}
                    <span>{p.method}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {p.balance === 0 ? (
                    <Badge variant="default">Paid</Badge>
                  ) : (
                    <span className="text-amber-600 font-medium">KES {p.balance.toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell>{p.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export { mockPayments, methodIcons };

