import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  Banknote,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Student {
  id: string;
  full_name: string;
  admission_number: string;
  current_level_id: string;
  cbc_levels?: { name: string } | { name: string }[];
}

interface FeePaymentPageProps {
  onBack: () => void;
}

export const FeePaymentPage: React.FC<FeePaymentPageProps> = ({ onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash' | 'bank'>('mpesa');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [realtimePayments, setRealtimePayments] = useState<any[]>([]);
  const { toast } = useToast();

  // Load students on component mount
  useEffect(() => {
    loadStudents();
    setupRealtimeSubscription();
    
    return () => {
      // Cleanup subscription
      supabase.channel('fee_payments_realtime').unsubscribe();
    };
  }, []);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          full_name,
          admission_number,
          current_level_id,
          cbc_levels!current_level_id (name)
        `)
        .eq('status', 'active')
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    // Listen for real-time payment updates
    const channel = supabase
      .channel('fee_payments_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'fee_payments'
        },
        (payload) => {
          console.log('New payment detected:', payload);
          setRealtimePayments(prev => [payload.new, ...prev]);
          toast({
            title: "Payment Detected",
            description: `New payment of KES ${payload.new.amount_paid} received`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'fee_payments'
        },
        (payload) => {
          console.log('Payment updated:', payload);
          if (payload.new.status === 'paid') {
            toast({
              title: "Payment Confirmed",
              description: `Payment has been confirmed and processed`,
            });
          }
        }
      )
      .subscribe();

    return channel;
  };

  const handleMpesaPayment = async () => {
    if (!selectedStudent || !amount || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    try {
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          operation: 'stk_push',
          phone_number: phoneNumber,
          amount: parseFloat(amount),
          student_id: selectedStudent.id,
          fee_structure_id: 'default-fee-structure',
          account_reference: `FEES-${selectedStudent.admission_number}`,
          transaction_desc: `School fees payment for ${selectedStudent.full_name}`
        }
      });

      if (error) throw error;

      if (data.success) {
        setPaymentStatus('success');
        toast({
          title: "STK Push Sent",
          description: "Please check your phone and enter your M-Pesa PIN",
        });

        // Start checking payment status
        checkPaymentStatus(data.checkout_request_id);
      } else {
        throw new Error(data.error || 'Failed to send STK Push');
      }
    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate M-Pesa payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (requestId: string) => {
    let attempts = 0;
    const maxAttempts = 20;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('mpesa-payment', {
          body: {
            operation: 'check_status',
            checkout_request_id: requestId
          }
        });

        if (error) {
          console.error('Status check error:', error);
          return;
        }

        if (data.status === 'paid') {
          setPaymentStatus('success');
          toast({
            title: "Payment Successful",
            description: `Payment of KES ${amount} has been received successfully.`,
          });
          resetForm();
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          toast({
            title: "Payment Failed",
            description: "The M-Pesa payment was not completed. Please try again.",
            variant: "destructive"
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 6000);
        } else {
          setPaymentStatus('failed');
          toast({
            title: "Timeout",
            description: "Payment status check timed out. Please check your M-Pesa messages.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    setTimeout(checkStatus, 3000);
  };

  const handleManualPayment = async () => {
    if (!selectedStudent || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('fee-management', {
        body: {
          operation: 'record_payment',
          student_id: selectedStudent.id,
          fee_structure_id: 'default-fee-structure',
          amount_paid: parseFloat(amount),
          payment_method: paymentMethod === 'cash' ? 'Cash' : 'Bank Transfer',
          status: 'paid',
          recorded_by: null
        }
      });

      if (error) throw error;

      toast({
        title: "Payment Recorded",
        description: `Manual payment of KES ${amount} has been recorded successfully.`,
      });

      resetForm();
    } catch (error: any) {
      console.error('Manual payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setAmount('');
    setPhoneNumber('');
    setPaymentStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 shadow-lg">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="flex items-center justify-between pt-5 pb-2">
            <div className="flex items-center gap-2.5">
              <button onClick={onBack} className="w-[34px] h-[34px] rounded-[10px] bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-white hover:bg-white/30 transition-colors">
                <ArrowLeft size={15} />
              </button>
              <div>
                <div className="text-[11px] text-white/80 font-medium tracking-wider uppercase">Center of Hope</div>
                <div className="text-[13px] text-white font-semibold mt-px">Payment Portal</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-1.5">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-xs font-semibold">Live Processing</span>
              </div>
            </div>
          </div>
          <div className="pt-7 pb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight m-0 leading-tight">Fee Payment</h1>
            <p className="text-white/80 text-sm mt-1.5">Process M-Pesa, Cash, or Bank payments</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-7 pb-12 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Process Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Student Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Select Student</Label>
                  <Select onValueChange={(value) => {
                    const student = students.find(s => s.id === value);
                    setSelectedStudent(student || null);
                  }}>
                    <SelectTrigger className="h-11 border-gray-200 bg-white">
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name} - {student.admission_number} ({student.cbc_levels?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Payment Method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`flex items-center gap-2 h-11 ${paymentMethod === 'mpesa' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Smartphone className="w-4 h-4" />
                      M-Pesa
                    </Button>
                    <Button
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center gap-2 h-11 ${paymentMethod === 'cash' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Banknote className="w-4 h-4" />
                      Cash
                    </Button>
                    <Button
                      variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('bank')}
                      className={`flex items-center gap-2 h-11 ${paymentMethod === 'bank' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Bank
                    </Button>
                  </div>
                </div>

                {/* M-Pesa Phone Number */}
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">M-Pesa Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0712345678 or 254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-11 border-gray-200 bg-white"
                    />
                  </div>
                )}

                {/* Payment Status */}
                {paymentStatus !== 'idle' && (
                  <Alert className={
                    paymentStatus === 'success' ? 'border-green-200 bg-green-50' :
                    paymentStatus === 'failed' ? 'border-red-200 bg-red-50' :
                    'border-yellow-200 bg-yellow-50'
                  }>
                    {paymentStatus === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                    {paymentStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {paymentStatus === 'failed' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    <AlertDescription className={
                      paymentStatus === 'success' ? 'text-green-800' :
                      paymentStatus === 'failed' ? 'text-red-800' :
                      'text-yellow-800'
                    }>
                      {paymentStatus === 'pending' && 'Processing payment... Please check your phone for STK push.'}
                      {paymentStatus === 'success' && 'Payment processed successfully!'}
                      {paymentStatus === 'failed' && 'Payment failed. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {paymentMethod === 'mpesa' ? (
                    <Button 
                      onClick={handleMpesaPayment}
                      disabled={isProcessing || !selectedStudent || !amount || !phoneNumber}
                      className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending STK Push...
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4 mr-2" />
                          Send STK Push
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleManualPayment}
                      disabled={isProcessing || !selectedStudent || !amount}
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Recording...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Record Payment
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetForm} className="h-12 border-gray-200 text-gray-700 hover:bg-gray-50">
                    Clear Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Payment Updates */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {realtimePayments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No recent payments detected</p>
                      <p className="text-gray-400 text-xs mt-1">Payments will appear here in real-time</p>
                    </div>
                  ) : (
                    realtimePayments.map((payment, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-sm text-green-800">Payment Detected</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Amount: KES {payment.amount_paid?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePaymentPage;

