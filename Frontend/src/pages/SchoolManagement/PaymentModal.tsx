// PaymentModal.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Banknote,
  Clock
} from "lucide-react";

const PLAN_PRICING = {
  basic: { monthly: 2500, termly: 6500, annually: 24000 },
  standard: { monthly: 5000, termly: 13000, annually: 48000 },
  premium: { monthly: 9500, termly: 25000, annually: 90000 },
};

const SUBSCRIPTION_LABELS = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

const formatExpiryDate = (billingCycle: string) => {
  const now = new Date();
  const expiry = new Date(now);

  if (billingCycle === "annually") {
    expiry.setMonth(expiry.getMonth() + 12);
  } else if (billingCycle === "termly") {
    expiry.setMonth(expiry.getMonth() + 4);
  } else {
    expiry.setMonth(expiry.getMonth() + 1);
  }

  return expiry.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const PaymentModal = ({ school, open, onClose, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [phoneNumber, setPhoneNumber] = useState(school?.phone_number || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // form, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentResult, setPaymentResult] = useState<any>(null);
  
  if (!school) return null;
  
  const subscription = school.subscription_plan || "basic";
  const price = PLAN_PRICING[subscription] || PLAN_PRICING.basic;
  const amount = price[billingCycle] || PLAN_PRICING.basic.monthly;
  
  const handleSTKPush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/v1/schools/${school.id}/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          plan: subscription,
          billing_cycle: billingCycle,
          payment_method: "mpesa",
          amount_paid: amount,
          transaction_id: `TXN${Date.now()}`,
          payment_reference: phoneNumber,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Payment failed. Please try again.");
      }

      const result = {
        transactionId: data.data.receipt_number,
        amount,
        method: "mpesa",
        billingCycle,
        subscription: data.data.subscription,
        expiryDate: formatExpiryDate(billingCycle),
      };

      setPaymentResult(result);
      setPaymentStep("success");
      setIsProcessing(false);

      onPaymentComplete(school.id, result);

      setTimeout(() => {
        onClose();
        setPaymentStep("form");
        setPhoneNumber("");
        setPaymentResult(null);
      }, 2000);
    } catch (error: any) {
      setPaymentStep("error");
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSubscriptionPayment = async (method: string) => {
    setIsProcessing(true);
    setPaymentStep("processing");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/v1/schools/${school.id}/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          plan: subscription,
          billing_cycle: billingCycle,
          payment_method: method,
          amount_paid: amount,
          transaction_id: `TXN${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Payment failed. Please try again.");
      }

      const result = {
        transactionId: data.data.receipt_number,
        amount,
        method,
        billingCycle,
        subscription: data.data.subscription,
        expiryDate: formatExpiryDate(billingCycle),
      };

      setPaymentResult(result);
      setPaymentStep("success");
      setIsProcessing(false);

      onPaymentComplete(school.id, result);

      setTimeout(() => {
        onClose();
        setPaymentStep("form");
        setPaymentResult(null);
      }, 2000);
    } catch (error: any) {
      setPaymentStep("error");
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleCardPayment = () => {
    handleSubscriptionPayment("card");
  };

  const handleBankTransfer = () => {
    setPaymentStep("bank_details");
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
        setPaymentStep("form");
        setErrorMessage("");
        setPaymentResult(null);
      }
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Confirm Subscription Payment
          </DialogTitle>
          <DialogDescription>
            {school.name} — select a secure payment method and complete activation for the {SUBSCRIPTION_LABELS[subscription]} plan.
          </DialogDescription>
        </DialogHeader>
        
        {paymentStep === "form" && (
          <div className="space-y-6 py-4">
            {/* Price Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl text-center border border-blue-100">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-blue-600">KES {amount.toLocaleString()}</p>
            </div>
            
            {/* Billing Cycle Toggle */}
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                {[
                  { key: "monthly", label: "Monthly", labelSuffix: "/mo" },
                  { key: "termly", label: "Termly", labelSuffix: "" },
                  { key: "annually", label: "Annually", labelSuffix: "/yr" },
                ].map((cycle) => (
                  <button
                    key={cycle.key}
                    className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                      billingCycle === cycle.key
                        ? "bg-white shadow-md text-blue-600 border border-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setBillingCycle(cycle.key)}
                  >
                    <div>{cycle.label}</div>
                    <div className="text-xs text-muted-foreground">
                      KES {price[cycle.key].toLocaleString()}{cycle.labelSuffix}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Subscription verification</span>
              </div>
              <p className="leading-6">
                Once payment is confirmed, your {SUBSCRIPTION_LABELS[subscription]} plan will be activated immediately.
                Your subscription will remain valid until <span className="font-semibold">{formatExpiryDate(billingCycle)}</span>.
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === "mpesa" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3 flex-1">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Smartphone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">M-Pesa STK Push</p>
                        <p className="text-xs text-muted-foreground">Instant payment from your phone</p>
                      </div>
                    </Label>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f5/M-PESA_Logo.svg" alt="M-Pesa" className="h-8" />
                </div>

                <div className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3 flex-1">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Card Payment</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">💳</span>
                    <span className="text-xl">💳</span>
                  </div>
                </div>

                <div className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === "bank" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3 flex-1">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Banknote className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">Manual payment via bank</p>
                      </div>
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">1-2 business days</span>
                </div>
              </RadioGroup>
            </div>

            {/* M-Pesa Phone Input */}
            {paymentMethod === "mpesa" && (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="font-mono text-lg"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>You'll receive an STK push on this number. Enter your PIN when prompted.</span>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (paymentMethod === "mpesa") handleSTKPush();
                  else if (paymentMethod === "card") handleCardPayment();
                  else if (paymentMethod === "bank") handleBankTransfer();
                }}
                disabled={paymentMethod === "mpesa" && !phoneNumber}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Pay KES {amount.toLocaleString()}
              </Button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground">
              By completing this payment, you agree to our Terms of Service
            </p>
          </div>
        )}
        
        {paymentStep === "processing" && (
          <div className="py-16 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full animate-ping"></div>
              </div>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto relative" />
            </div>
            <p className="font-medium text-lg">Processing Payment</p>
            <p className="text-sm text-muted-foreground">
              {paymentMethod === "mpesa" 
                ? "Please check your phone and enter M-Pesa PIN" 
                : "Please wait while we process your payment"}
            </p>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        
        {paymentStep === "success" && (
          <div className="py-16 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-medium text-xl text-green-600">Payment Verified</p>
            <p className="text-sm text-muted-foreground">
              Your {SUBSCRIPTION_LABELS[subscription]} subscription is active and verified.
            </p>
            {paymentResult && (
              <div className="mx-auto max-w-md rounded-2xl border border-green-100 bg-green-50 p-4 text-left text-sm text-slate-700 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Subscription confirmed</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction</span>
                    <span className="font-medium">{paymentResult.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">KES {paymentResult.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing cycle</span>
                    <span className="font-medium">{paymentResult.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires on</span>
                    <span className="font-medium">{paymentResult.expiryDate}</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">You will be redirected shortly once verification is complete.</p>
          </div>
        )}
        
        {paymentStep === "error" && (
          <div className="py-16 text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <p className="font-medium text-xl text-red-600">Payment Failed</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button onClick={() => setPaymentStep("form")} variant="outline">
              Try Again
            </Button>
          </div>
        )}
        
        {paymentStep === "bank_details" && (
          <div className="py-6 space-y-4">
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Bank Transfer Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank Name:</span>
                  <span className="font-medium">KCB Bank Kenya</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="font-medium">SchoolSoft Technologies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-mono font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-mono font-medium text-purple-600">{school.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold">KES {amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              After transfer, we'll activate your account within 24 hours
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaymentStep("form")} className="flex-1">
                Back
              </Button>
              <Button onClick={() => onClose()} className="flex-1">
                I'll Complete Later
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};