'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Search, Loader2, Package, Flame, MapPin, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/repositories/orders';
import { SITE_CONFIG } from '@/lib/config';

const STATUS_STEPS: OrderStatus[] = ['Registered', 'Paid', 'Printing', 'Ready', 'Collected'];

export default function MyOrderPage() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentNumber.trim()) {
      setError('Please provide your college enrollment number');
      return;
    }

    setLoading(true);
    setError(null);
    setOrders(null);

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentNumber: enrollmentNumber.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'No order records found');
      }

      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-yellow-electric font-mono text-xs font-bold px-3 py-1 uppercase skew-tag border border-yellow-electric/30">
            <Flame className="w-3.5 h-3.5 skew-tag-inner fill-yellow-electric" />
            <span className="skew-tag-inner">CAMPUS LIVE TRACKING</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight uppercase text-white leading-none">
            TRACK YOUR JERSEY
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Enter your college enrollment number to instantly view production status, printing stage, and your SAC collection QR pass.
          </p>
        </div>

        {/* Lookup Card Form */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                  COLLEGE ENROLLMENT NUMBER *
                </label>
                <input
                  type="text"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 2026CSE042"
                  required
                  className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-pink-hot px-4 py-3 text-sm text-white font-mono uppercase focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                  COLLEGE EMAIL (OPTIONAL)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@campus.edu"
                  className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-yellow-electric px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-zinc-500">
                Tip: Try demo seeds &apos;2026CSE042&apos;, &apos;2026AIML018&apos;, or &apos;2026MECH104&apos;
              </span>

              <button
                type="submit"
                disabled={loading}
                className="btn-hard-pink skew-tag px-8 py-3.5 flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                <span className="skew-tag-inner font-display text-base uppercase tracking-wider text-black flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SEARCHING...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>FIND REGISTRATION</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 p-5 text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-red-400">NO REGISTRATION FOUND</p>
              <p className="text-xs">{error}</p>
              <div className="pt-2">
                <Link
                  href="/register"
                  className="text-yellow-electric underline font-mono text-xs uppercase font-bold"
                >
                  Create a new registration now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {orders && orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-yellow-electric italic uppercase tracking-wider">
              MATCHED REGISTRATIONS ({orders.length})
            </h2>

            {orders.map((order) => {
              const currentStepIdx = STATUS_STEPS.indexOf(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-[#13131F] border-2 border-pink-hot p-6 sm:p-8 shadow-hard-yellow space-y-6 relative"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232338] pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                        ORDER REFERENCE
                      </span>
                      <span className="font-display text-3xl font-black text-white italic tracking-wider">
                        {order.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-[#1A1A2E] border border-yellow-electric text-yellow-electric text-xs font-mono font-bold px-3 py-1 uppercase">
                        {order.status}
                      </span>
                      <Link
                        href={`/order/${order.id}`}
                        className="btn-hard-pink text-xs px-3.5 py-1.5 skew-tag uppercase text-black font-display font-bold flex items-center gap-1"
                      >
                        <span className="skew-tag-inner flex items-center gap-1">
                          FULL RECEIPT <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Status Stepper */}
                  <div className="p-4 bg-[#0B0B12] border border-[#232338]">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-3">
                      TRACKING PIPELINE:
                    </span>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      {STATUS_STEPS.map((statusName, idx) => {
                        const isPassed = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={statusName} className="space-y-1.5">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? 'bg-pink-hot shadow-[0_0_8px_#FF2E93]'
                                  : isPassed
                                  ? 'bg-yellow-electric'
                                  : 'bg-zinc-800'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-display uppercase tracking-wider block ${
                                isCurrent
                                  ? 'text-pink-hot font-black'
                                  : isPassed
                                  ? 'text-yellow-electric font-bold'
                                  : 'text-zinc-600'
                              }`}
                            >
                              {statusName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid: Details & QR Pass */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Info */}
                    <div className="md:col-span-2 space-y-2 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-zinc-500 block">Student:</span>
                          <span className="text-white font-bold">{order.student.fullName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Enrollment:</span>
                          <span className="text-yellow-electric font-bold">
                            {order.student.enrollmentNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Department:</span>
                          <span className="text-zinc-300">{order.student.department}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Back Name & #:</span>
                          <span className="text-pink-hot font-display text-base font-bold">
                            {order.jersey.customName} #{order.jersey.jerseyNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Size & Qty:</span>
                          <span className="text-white">
                            {order.jersey.size} ({order.jersey.quantity}x)
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Payment:</span>
                          <span className="text-green-400 font-bold uppercase">
                            {order.payment.status} ({order.payment.method.toUpperCase()})
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-1.5 text-zinc-400 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-yellow-electric shrink-0" />
                        <span>Pickup: {SITE_CONFIG.collectionVenue}</span>
                      </div>
                    </div>

                    {/* Right: Instant QR code badge */}
                    <div className="flex flex-col items-center justify-center bg-[#0B0B12] border border-[#232338] p-4 text-center">
                      <div className="bg-white p-2 rounded">
                        <QRCodeSVG
                          value={`JERSEY_AUTH:${order.id}:${order.student.enrollmentNumber}`}
                          size={84}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 mt-2 uppercase font-bold">
                        COLLECTION PASS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

