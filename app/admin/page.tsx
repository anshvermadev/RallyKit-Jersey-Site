'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  KeyRound,
  Download,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Shirt,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Order, OrderStatus } from '@/lib/repositories/orders';
import { SITE_CONFIG } from '@/lib/config';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAdminData = useCallback(async (code: string) => {
    setLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/orders?passcode=${encodeURIComponent(code)}`, {
        headers: { 'x-admin-passcode': code },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setOrders(data.orders || []);
      setSummary(data.summary || null);
      setIsAuthenticated(true);
      setAuthError('');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid admin passcode');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminData(passcode);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setActionMessage(`Updated ${orderId} to "${newStatus}"`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Created At',
      'Student Name',
      'Enrollment Number',
      'Email',
      'Phone',
      'Department',
      'Year',
      'Jersey Name',
      'Jersey Number',
      'Size',
      'Quantity',
      'Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Production Status',
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.student.fullName}"`,
      `"${o.student.enrollmentNumber}"`,
      `"${o.student.collegeEmail}"`,
      `"${o.student.phone}"`,
      `"${o.student.department}"`,
      `"${o.student.year}"`,
      `"${o.jersey.customName}"`,
      `"${o.jersey.jerseyNumber}"`,
      `"${o.jersey.size}"`,
      `"${o.jersey.quantity}"`,
      `"${o.pricing.total}"`,
      `"${o.payment.method}"`,
      `"${o.payment.status}"`,
      `"${o.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `JERSEY_HQ_REGISTRATIONS_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        o.student.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.jersey.customName.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (deptFilter !== 'ALL' && o.jersey.departmentSlug !== deptFilter) return false;
      if (sizeFilter !== 'ALL' && o.jersey.size !== sizeFilter) return false;
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;

      return true;
    });
  }, [orders, search, deptFilter, sizeFilter, statusFilter]);

  // Unauthenticated: Password Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B12] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#13131F] border-2 border-pink-hot p-8 shadow-hard-pink relative">
          <div className="w-12 h-12 bg-pink-hot text-black flex items-center justify-center skew-tag mx-auto mb-4">
            <Lock className="w-6 h-6 skew-tag-inner" />
          </div>

          <h1 className="font-display text-3xl font-black italic text-center text-white tracking-wider uppercase">
            ADMIN DEMO GATEWAY
          </h1>
          <p className="text-xs text-zinc-400 text-center mt-1">
            Protected demonstration portal for campus operations & batch dispatch.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                ENTER ADMIN PASSCODE
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Default: admin123"
                  className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-yellow-electric px-4 py-3 text-sm text-white font-mono focus:outline-none"
                />
                <KeyRound className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                (Demo environment passcode configured as: <strong>admin123</strong>)
              </span>
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-mono bg-red-500/10 p-2 border border-red-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-hard-pink w-full py-3.5 font-display text-lg uppercase tracking-wider text-black block text-center"
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-white underline font-mono">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CHART_COLORS = ['#FF2E93', '#FFE600', '#00F0FF', '#FF1744', '#00FF88', '#8A2BE2', '#FF9100'];

  return (
    <div className="min-h-screen bg-[#0B0B12] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232338] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-yellow-electric font-mono text-xs font-bold px-3 py-1 uppercase skew-tag mb-1">
              <Shield className="w-3.5 h-3.5 skew-tag-inner" />
              <span className="skew-tag-inner">CAMPUS CONTROL ROOM</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black italic tracking-tight uppercase text-white leading-none">
              REGISTRATIONS & PRODUCTION
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAdminData(passcode)}
              className="bg-[#13131F] text-zinc-300 hover:text-white border border-[#232338] px-4 py-2.5 text-xs font-display uppercase tracking-wider flex items-center gap-1.5"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC</span>
            </button>

            <button
              onClick={exportCSV}
              className="btn-hard-yellow skew-tag px-5 py-2.5 text-xs font-display uppercase tracking-wider text-black flex items-center gap-2"
            >
              <span className="skew-tag-inner flex items-center gap-1.5">
                <Download className="w-4 h-4" /> EXPORT CSV
              </span>
            </button>
          </div>
        </div>

        {/* Action toast message */}
        {actionMessage && (
          <div className="bg-green-500/15 border-2 border-green-500 p-3 text-green-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> {actionMessage}
          </div>
        )}

        {/* Summary Metric Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#13131F] border-2 border-[#232338] p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase mb-2">
                <span>TOTAL ORDERS</span>
                <Shirt className="w-4 h-4 text-pink-hot" />
              </div>
              <div className="font-display text-4xl font-black text-white italic">
                {summary.totalOrders}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                {summary.paidOrders} confirmed payments
              </span>
            </div>

            <div className="bg-[#13131F] border-2 border-[#232338] p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase mb-2">
                <span>TOTAL REVENUE (DEMO)</span>
                <DollarSign className="w-4 h-4 text-yellow-electric" />
              </div>
              <div className="font-display text-4xl font-black text-yellow-electric italic">
                ₹{summary.totalRevenue}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Avg ₹599 per student kit
              </span>
            </div>

            <div className="bg-[#13131F] border-2 border-[#232338] p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase mb-2">
                <span>IN PRINTING PIPELINE</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="font-display text-4xl font-black text-cyan-400 italic">
                {summary.statusCounts?.Printing || 0}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Active sublimation batch
              </span>
            </div>

            <div className="bg-[#13131F] border-2 border-[#232338] p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase mb-2">
                <span>READY FOR PICKUP</span>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <div className="font-display text-4xl font-black text-green-400 italic">
                {summary.statusCounts?.Ready || 0}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                At SAC Counter 4
              </span>
            </div>
          </div>
        )}

        {/* Charts & Department Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Size Distribution Bar Chart (Recharts) */}
          <div className="lg:col-span-7 bg-[#13131F] border-2 border-[#232338] p-6 shadow-xl space-y-4">
            <h3 className="font-display text-xl font-bold italic text-white uppercase tracking-wider">
              SIZE DISTRIBUTION (RECHARTS)
            </h3>
            <p className="text-xs text-zinc-400">
              Aggregated units requested per athletic size across all branches.
            </p>
            <div className="h-64 w-full pt-4">
              {summary?.sizeDistribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.sizeDistribution}>
                    <XAxis
                      dataKey="size"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B0B12',
                        border: '1px solid #FF2E93',
                        borderRadius: '0px',
                        color: '#FFE600',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {summary.sizeDistribution.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Department Breakdown Counts */}
          <div className="lg:col-span-5 bg-[#13131F] border-2 border-[#232338] p-6 shadow-xl space-y-4">
            <h3 className="font-display text-xl font-bold italic text-white uppercase tracking-wider">
              BRANCH ORDER VOLUME
            </h3>
            <p className="text-xs text-zinc-400">
              Live registration tallies by department.
            </p>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
              {summary?.departmentCounts &&
                Object.entries(summary.departmentCounts).map(([deptName, count]: any) => (
                  <div
                    key={deptName}
                    className="flex items-center justify-between p-2.5 bg-[#0B0B12] border border-[#232338] text-xs font-mono"
                  >
                    <span className="text-zinc-300 truncate max-w-[220px] font-bold">
                      {deptName}
                    </span>
                    <span className="bg-[#1A1A2E] text-yellow-electric px-2.5 py-0.5 border border-yellow-electric/40 font-bold">
                      {count} Units
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative flex-grow sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID, name, enrollment..."
                className="w-full bg-[#0B0B12] border border-[#232338] focus:border-pink-hot px-3 py-2 pl-9 text-xs text-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0B0B12] border border-[#232338] text-xs text-white px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Paid">Paid</option>
              <option value="Printing">Printing</option>
              <option value="Ready">Ready</option>
              <option value="Collected">Collected</option>
            </select>

            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="bg-[#0B0B12] border border-[#232338] text-xs text-white px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="2XL">2XL</option>
              <option value="3XL">3XL</option>
            </select>
          </div>

          <span className="text-xs font-mono text-zinc-500 shrink-0">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>

        {/* Orders Table */}
        <div className="bg-[#13131F] border-2 border-[#232338] overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#181829] text-zinc-400 uppercase border-b border-[#232338]">
              <tr>
                <th className="py-3 px-4">ORDER ID</th>
                <th className="py-3 px-4">STUDENT</th>
                <th className="py-3 px-4">ENROLLMENT</th>
                <th className="py-3 px-4">BRANCH</th>
                <th className="py-3 px-4">CUSTOM NAME & #</th>
                <th className="py-3 px-4">SIZE</th>
                <th className="py-3 px-4">STATUS UPDATE</th>
                <th className="py-3 px-4">PAYMENT</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232338]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#1A1A2E]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-yellow-electric">
                    {o.id}
                  </td>
                  <td className="py-3.5 px-4 text-white font-bold">
                    {o.student.fullName}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    {o.student.enrollmentNumber}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 truncate max-w-[150px]">
                    {o.jersey.departmentName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-pink-hot font-bold">{o.jersey.customName}</span>{' '}
                    <span className="text-yellow-electric font-black">#{o.jersey.jerseyNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 text-white font-bold">
                    {o.jersey.size}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      className="bg-[#0B0B12] border border-zinc-700 text-xs px-2 py-1 text-white focus:outline-none focus:border-pink-hot"
                    >
                      <option value="Registered">Registered</option>
                      <option value="Paid">Paid</option>
                      <option value="Printing">Printing</option>
                      <option value="Ready">Ready</option>
                      <option value="Collected">Collected</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                        o.payment.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : o.payment.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-electric'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {o.payment.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/order/${o.id}`}
                      className="text-pink-hot hover:text-yellow-electric underline text-[11px]"
                      target="_blank"
                    >
                      View Pass →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              No orders found matching the filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
