// PaymentComponent.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Smartphone, Building, Loader2, CheckCircle } from "lucide-react";

const SUBSCRIPTION_PRICES = {
  basic: { monthly: 2999, yearly: 29990, features: ["Up to 500 students", "Basic reports", "Email support"] },
  standard: { monthly: 5999, yearly: 59990, features: ["Up to 2000 students", "Advanced reports", "Priority support", "SMS integration"] },
  premium: { monthly: 9999, yearly: 99990, features: ["Unlimited students", "All features", "24/7 phone support", "Custom branding", "API access"] },
};

export const PaymentComponent = ({ school, open, onClose, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // form, processing, success

  const subscription = school?.subscription || "basic";
  const amount = SUBSCRIPTION_PRICES[subscription][billingCycle];
  
  const handleSTKPush = async () => {
    setIsProcessing(true);
    setPaymentStep("processing");
    
    try {
      // Initiate STK Push to school's registered phone
      const response = await fetch("/api/payments/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: school.phone || phoneNumber,
          amount: amount,
          accountReference: `SUB-${school.code}`,
          transactionDesc: `${SUBSCRIPTION_LABELS[subscription]} Subscription - ${billingCycle}`,
          schoolId: school.id,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Poll for payment confirmation
        checkPaymentStatus(data.checkoutRequestID);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setIsProcessing(false);
      setPaymentStep("form");
    }
  };
  
  const checkPaymentStatus = async (checkoutRequestID) => {
    // Poll every 3 seconds for 60 seconds
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const statusResponse = await fetch("/api/payments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestID }),
      });
      
      const status = await statusResponse.json();
      
      if (status.resultCode === 0) {
        // Payment successful
        clearInterval(interval);
        setPaymentStep("success");
        setIsProcessing(false);
        
        // Update school subscription status
        await fetch("/api/schools/update-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schoolId: school.id,
            subscription: school.subscription,
            billingCycle: billingCycle,
            expiryDate: new Date(Date.now() + (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
          }),
        });
        
        onPaymentComplete(school.id);
        setTimeout(() => onClose(), 2000);
      } else if (attempts > 20) {
        // Timeout after 60 seconds
        clearInterval(interval);
        setIsProcessing(false);
        setPaymentStep("form");
        alert("Payment timeout. Please try again.");
      }
    }, 3000);
  };
  
  const handleCardPayment = () => {
    // Redirect to payment gateway (Stripe/Pesapal/etc.)
    window.location.href = `/checkout?school=${school.id}&plan=${subscription}&cycle=${billingCycle}&amount=${amount}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Complete Your {SUBSCRIPTION_LABELS[subscription]} Subscription
          </DialogTitle>
          <DialogDescription>
            {school?.name} - Activate your account to start managing your school
          </DialogDescription>
        </DialogHeader>
        
        {paymentStep === "form" && (
          <div className="space-y-6 py-4">
            {/* Price Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold text-blue-600">KES {amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {billingCycle === "monthly" ? "Billed monthly" : "Billed annually (Save 15%)"}
              </p>
            </div>
            
            {/* Billing Cycle Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  billingCycle === "monthly" 
                    ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  billingCycle === "yearly" 
                    ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly <span className="text-xs text-green-600">Save 15%</span>
              </button>
            </div>
            
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <div className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">M-Pesa STK Push</p>
                        <p className="text-xs text-muted-foreground">Pay via M-Pesa on your phone</p>
                      </div>
                    </Label>
                  </div>
                  <img src="/mpesa-logo.png" alt="M-Pesa" className="h-6" />
                </div>
                
                <div className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Card Payment</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs">💳 Visa</span>
                    <span className="text-xs">💳 Mastercard</span>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* M-Pesa Phone Input */}
            {paymentMethod === "mpesa" && (
              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send an STK push to this number. Enter the M-Pesa PIN when prompted.
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={paymentMethod === "mpesa" ? handleSTKPush : handleCardPayment}
                disabled={paymentMethod === "mpesa" && !phoneNumber}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Pay KES {amount.toLocaleString()}
              </Button>
            </div>
          </div>
        )}
        
        {paymentStep === "processing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="font-medium">Awaiting M-Pesa PIN entry...</p>
            <p className="text-sm text-muted-foreground">Please check your phone and enter your PIN</p>
          </div>
        )}
        
        {paymentStep === "success" && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <p className="font-medium text-lg">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">
              Your {SUBSCRIPTION_LABELS[subscription]} subscription is now active.
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};