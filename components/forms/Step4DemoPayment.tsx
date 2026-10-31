'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { getDepartmentBySlug, DEPARTMENTS } from '@/data/departments';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function Step4DemoPayment() {
  const router = useRouter();
  const {
    studentData,
    jerseyData,
    paymentMethod,
    setPaymentMethod,
    simulateFailure,
    setSimulateFailure,
    clearDraft,
    prevStep,
  } = useRegistrationStore();

  const [upiId, setUpiId] = useState('student@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const dept = getDepartmentBySlug(jerseyData.departmentSlug || 'cse') || DEPARTMENTS[0];
  const quantity = jerseyData.quantity || 1;
  const totalAmount = dept.basePrice * quantity;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    try {
      setProcessingStatus('1/3 Contacting campus demo gateway...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStatus('2/3 Validating student enrollment authorization...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStatus('3/3 Finalizing simulated transaction...');
      await new Promise((r) => setTimeout(r, 600));

      // Call API /api/register
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: studentData,
          jersey: jerseyData,
          paymentMethod,
          simulateFailure,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error(
            data.message || `An active order already exists for enrollment # ${studentData.enrollmentNumber}`
          );
        }
        throw new Error(data.message || data.error || 'Payment declined by demo gateway.');
      }

      // If simulated failure was selected
      if (simulateFailure) {
        throw new Error(
          'Simulated payment failure (declined by card issuer / insufficient demo balance). Turn off the simulation switch below to succeed.'
        );
      }

      // Success! Clear draft and redirect to confirmation
      clearDraft();
      router.push(`/order/${data.orderId}`);
    } catch (err: any) {
      setPaymentError(err.message || 'Payment simulation failed.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Persistent Demo Warning Banner */}
      <div className="bg-gradient-to-r from-yellow-electric via-pink-hot to-yellow-electric p-3 text-black font-mono text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-md">
        <ShieldAlert className="w-4 h-4 text-black shrink-0" />
        <span>DEMO MODE GATEWAY: NO REAL MONEY IS CHARGED • SIMULATION ONLY</span>
      </div>

      <div className="border-b border-[#232338] pb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-black italic text-white tracking-wider uppercase">
          STEP 4: DEMO CHECKOUT GATEWAY
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Select your simulated payment method. Card data is never transmitted to an external bank.
        </p>
      </div>

      {/* Failure Alert Banner if declined */}
      {paymentError && (
        <div className="bg-red-500/15 border-2 border-red-500 p-4 text-red-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-red-400">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>TRANSACTION DECLINED / ERROR</span>
          </div>
          <p className="text-xs leading-relaxed">{paymentError}</p>
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSimulateFailure(false);
                setPaymentError(null);
              }}
              className="bg-red-500 text-white font-mono text-xs font-bold px-3 py-1.5 flex items-center gap-1 uppercase hover:bg-red-600"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Turn Off Fail Simulation & Retry
            </button>
          </div>
        </div>
      )}

      {/* Payment Method Selector */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod('upi')}
          className={`p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all ${
            paymentMethod === 'upi'
              ? 'border-yellow-electric bg-[#1A1A2E] shadow-hard-yellow'
              : 'border-[#232338] bg-[#0E0E18] text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <QrCode className="w-6 h-6 text-yellow-electric" />
          <span className="font-display text-sm uppercase italic tracking-wider text-white">
            UPI / QR
          </span>
          <span className="text-[10px] font-mono text-zinc-500">GPay, PhonePe, Paytm</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all ${
            paymentMethod === 'card'
              ? 'border-pink-hot bg-[#1A1A2E] shadow-hard-pink'
              : 'border-[#232338] bg-[#0E0E18] text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <CreditCard className="w-6 h-6 text-pink-hot" />
          <span className="font-display text-sm uppercase italic tracking-wider text-white">
            CREDIT / DEBIT
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Visa, Mastercard, RuPay</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('cash')}
          className={`p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all ${
            paymentMethod === 'cash'
              ? 'border-cyan-400 bg-[#1A1A2E] shadow-[4px_4px_0_0_#00F0FF]'
              : 'border-[#232338] bg-[#0E0E18] text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <Banknote className="w-6 h-6 text-cyan-400" />
          <span className="font-display text-sm uppercase italic tracking-wider text-white">
            COUNTER CASH
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Pay on kit collection</span>
        </button>
      </div>

      {/* Form Fields corresponding to method */}
      <form onSubmit={handlePay} className="bg-[#0B0B12] border-2 border-[#232338] p-6 space-y-6">
        {paymentMethod === 'upi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                ENTER FAKE VIRTUAL PAYMENT ADDRESS (VPA / UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okhdfcbank"
                className="w-full bg-[#13131F] border-2 border-[#232338] focus:border-yellow-electric px-4 py-3 text-sm text-yellow-electric font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Quick presets:</span>
              {['student@okaxis', 'campus@paytm', 'player@okhdfcbank'].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setUpiId(id)}
                  className="bg-[#1A1A2E] hover:bg-zinc-700 px-2 py-0.5 border border-zinc-700 text-zinc-300"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                SIMULATED CARD NUMBER
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                className="w-full bg-[#13131F] border-2 border-[#232338] focus:border-pink-hot px-4 py-3 text-sm text-pink-hot font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                  EXPIRY (MM/YY)
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                  className="w-full bg-[#13131F] border-2 border-[#232338] focus:border-pink-hot px-4 py-3 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                  CVV (3 DIGITS)
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  maxLength={4}
                  className="w-full bg-[#13131F] border-2 border-[#232338] focus:border-pink-hot px-4 py-3 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="bg-[#13131F] border border-cyan-500/30 p-4 space-y-2">
            <div className="flex items-center gap-2 font-display text-lg text-cyan-400 italic">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>COLLECTION COUNTER PAYMENT RESERVATION</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your jersey will be queued for printing. You can inspect the final print and pay ₹{totalAmount} in cash or UPI at SAC Counter 4 upon collection.
            </p>
          </div>
        )}

        {/* Developer Sandbox Simulation Switch */}
        <div className="pt-4 border-t border-[#1E1E30] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-mono text-xs font-bold text-yellow-electric flex items-center gap-1.5 uppercase">
              <span>DEV TOGGLE: SIMULATE TRANSACTION FAILURE</span>
            </span>
            <p className="text-[11px] text-zinc-500">
              Toggle on to test payment decline behavior, error handling & retry states.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulateFailure(!simulateFailure)}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
              simulateFailure ? 'bg-red-500 justify-end' : 'bg-[#232338] justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Submit & Back Controls */}
        <div className="pt-4 border-t border-[#232338] flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={isProcessing}
            className="px-6 py-3 bg-[#1A1A2E] text-zinc-300 hover:text-white border border-[#232338] font-display text-base uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-hard-pink skew-tag px-8 py-4 flex items-center gap-3 disabled:opacity-50"
          >
            <span className="skew-tag-inner font-display text-xl uppercase tracking-wider text-black flex items-center gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{processingStatus || 'PROCESSING...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'cash' ? 'CONFIRM DEMO RESERVATION' : `AUTHORIZE DEMO ₹${totalAmount}`}
                  </span>
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

