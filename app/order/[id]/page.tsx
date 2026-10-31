'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Copy,
  Printer,
  Calendar,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/repositories/orders';
import { SITE_CONFIG } from '@/lib/config';
import { getDepartmentBySlug, DEPARTMENTS } from '@/data/departments';

const STATUS_STEPS: OrderStatus[] = ['Registered', 'Paid', 'Printing', 'Ready', 'Collected'];

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF2E93', '#FFE600', '#00F0FF', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    // Fetch order from API
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Order not found');
        }
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || 'Could not load order');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params.id]);

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B12] flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-pulse">
          <Flame className="w-12 h-12 text-pink-hot mx-auto animate-bounce" />
          <h2 className="font-display text-2xl text-yellow-electric italic">
            RETRIEVING ORDER CONFIRMATION...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0B0B12] flex items-center justify-center p-6 text-center">
        <div className="bg-[#13131F] border-2 border-red-500 p-8 max-w-md w-full space-y-4">
          <h2 className="font-display text-3xl text-red-400 italic">ORDER NOT FOUND</h2>
          <p className="text-xs text-zinc-400">{error || 'Unable to locate order.'}</p>
          <Link
            href="/my-order"
            className="btn-hard-pink block py-3 text-sm font-display uppercase tracking-wider text-black"
          >
            TRACK VIA MY ORDER
          </Link>
        </div>
      </div>
    );
  }

  const dept = getDepartmentBySlug(order.jersey.departmentSlug) || DEPARTMENTS[0];
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#0B0B12] py-8 sm:py-12 print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-pink-hot via-[#FF1775] to-pink-hot text-black p-6 sm:p-8 skew-tag shadow-hard-yellow print:hidden">
          <div className="skew-tag-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-yellow-electric" />
              </div>
              <div>
                <span className="font-mono text-xs font-black uppercase tracking-widest bg-black text-yellow-electric px-2 py-0.5">
                  REGISTRATION CONFIRMED
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-black italic tracking-wider leading-tight uppercase mt-1">
                  YOU&apos;RE IN THE SQUAD!
                </h1>
              </div>
            </div>

            <button
              onClick={handlePrintReceipt}
              className="bg-black text-white hover:bg-yellow-electric hover:text-black px-4 py-2 text-xs font-display uppercase tracking-wider italic flex items-center gap-2 transition-colors shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT RECEIPT / PASS</span>
            </button>
          </div>
        </div>

        {/* Printable Pass Card */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-6 sm:p-8 shadow-2xl relative print:border-black print:bg-white print:shadow-none">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232338] pb-6 mb-6 print:border-black">
            <div>
              <span className="text-xs font-mono text-zinc-500 uppercase block print:text-zinc-700">
                OFFICIAL ORDER IDENTIFIER
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-display text-4xl sm:text-5xl font-black text-yellow-electric italic tracking-wider print:text-black">
                  {order.id}
                </span>
                <button
                  onClick={copyOrderId}
                  className="p-1.5 bg-[#1B1B2C] text-zinc-400 hover:text-white border border-zinc-700 transition-colors print:hidden"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && (
                  <span className="text-xs font-mono text-green-400 font-bold">COPIED!</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* QR Code for instant counter verification */}
              <div className="bg-white p-2.5 rounded shadow-md border-2 border-pink-hot print:border-black">
                <QRCodeSVG
                  value={`JERSEY_AUTH:${order.id}:${order.student.enrollmentNumber}`}
                  size={96}
                  level="H"
                />
              </div>
              <div className="text-left text-xs font-mono text-zinc-400 print:text-zinc-700 space-y-1">
                <p className="font-bold text-white uppercase print:text-black">COLLECTION QR PASS</p>
                <p>Present at Counter 4</p>
                <p className="text-[10px] text-zinc-500">{order.student.enrollmentNumber}</p>
              </div>
            </div>
          </div>

          {/* Status Stepper Strip */}
          <div className="mb-8 p-4 bg-[#0B0B12] border border-[#232338] print:border-black print:bg-zinc-100">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold block mb-3">
              KIT PRODUCTION STATUS:
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

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Details */}
            <div className="space-y-4">
              <h3 className="font-display text-lg text-white uppercase italic tracking-wider border-b border-[#232338] pb-2 print:text-black">
                STUDENT CREDENTIALS
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Student Name:</span>
                  <span className="text-white font-bold">{order.student.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Enrollment #:</span>
                  <span className="text-yellow-electric font-bold">
                    {order.student.enrollmentNumber}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-zinc-300">{order.student.collegeEmail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Phone:</span>
                  <span className="text-zinc-300">+91 {order.student.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Branch & Year:</span>
                  <span className="text-zinc-300">
                    {order.student.department} ({order.student.year})
                  </span>
                </div>
              </div>

              {/* Collection Venue Box */}
              <div className="bg-[#181829] border-l-4 border-yellow-electric p-3.5 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-yellow-electric uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>COLLECTION POINT</span>
                </div>
                <p className="text-zinc-300">{SITE_CONFIG.collectionVenue}</p>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Dates will be notified by email & SMS
                </p>
              </div>
            </div>

            {/* Jersey Customization Specs & Visual Preview */}
            <div className="space-y-4">
              <h3 className="font-display text-lg text-white uppercase italic tracking-wider border-b border-[#232338] pb-2 print:text-black">
                CUSTOM JERSEY SPECIFICATIONS
              </h3>

              {/* Mini visual preview */}
              <div className="relative w-full h-36 bg-[#0B0B12] border border-[#232338] flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 160 180" className="w-28 h-32 drop-shadow-lg">
                  <path
                    d="M 25,45 L 0,70 L 20,105 L 40,75 Z"
                    fill={order.jersey.sleeveColor || dept.secondaryColor}
                  />
                  <path
                    d="M 135,45 L 160,70 L 140,105 L 120,75 Z"
                    fill={order.jersey.sleeveColor || dept.secondaryColor}
                  />
                  <path d="M 35,45 L 125,45 L 130,170 L 30,170 Z" fill={dept.primaryColor} />
                  <path
                    d="M 55,45 Q 80,75 105,45 Z"
                    fill={order.jersey.collarColor || dept.collarColors[0] || '#FFE600'}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="font-display text-xs text-white uppercase bg-black/60 px-2 py-0.5 tracking-wider">
                    {order.jersey.customName}
                  </span>
                  <span className="font-display text-3xl text-yellow-electric font-black mt-1">
                    {order.jersey.jerseyNumber}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Back Custom Name:</span>
                  <span className="text-pink-hot font-display text-base font-bold">
                    {order.jersey.customName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Jersey Number:</span>
                  <span className="text-yellow-electric font-display text-lg font-black">
                    #{order.jersey.jerseyNumber}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Athletic Size:</span>
                  <span className="text-white font-bold">{order.jersey.size}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Quantity:</span>
                  <span className="text-white">{order.jersey.quantity}x</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A2E]">
                  <span className="text-zinc-500">Payment Status:</span>
                  <span
                    className={`font-bold uppercase ${
                      order.payment.status === 'paid'
                        ? 'text-green-400'
                        : order.payment.status === 'pending'
                        ? 'text-yellow-electric'
                        : 'text-red-400'
                    }`}
                  >
                    {order.payment.status} ({order.payment.method.toUpperCase()})
                  </span>
                </div>
                <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                  <span className="text-white">Amount Total:</span>
                  <span className="text-yellow-electric font-display text-xl">
                    ₹{order.pricing.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-8 pt-6 border-t border-[#232338] flex items-center justify-between text-xs text-zinc-500 font-mono print:text-black">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pink-hot" /> Official Campus League Merchandise
            </span>
            <span>Recorded: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 print:hidden">
          <Link
            href="/my-order"
            className="text-zinc-400 hover:text-yellow-electric text-xs font-mono uppercase flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Track order status anytime via My Order</span>
          </Link>

          <Link
            href="/jerseys"
            className="btn-hard-yellow skew-tag px-6 py-3 font-display text-base uppercase tracking-wider text-black flex items-center gap-2"
          >
            <span className="skew-tag-inner flex items-center gap-2">
              <span>EXPLORE MORE JERSEYS</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

