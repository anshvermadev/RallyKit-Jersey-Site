'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentSchema, StudentFormData } from '@/lib/validators/order';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { DEPARTMENTS } from '@/data/departments';
import { ArrowRight, User, Hash, Mail, Phone, Building2, Calendar, ShieldCheck } from 'lucide-react';

export default function Step1StudentDetails() {
  const { studentData, setStudentData, nextStep } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      fullName: studentData.fullName || '',
      enrollmentNumber: studentData.enrollmentNumber || '',
      collegeEmail: studentData.collegeEmail || '',
      phone: studentData.phone || '',
      department: studentData.department || DEPARTMENTS[0].name,
      year: studentData.year || '1st Year',
      division: studentData.division || 'A',
    },
  });

  const onSubmit = (data: StudentFormData) => {
    setStudentData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-[#232338] pb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-black italic text-white tracking-wider uppercase">
          STEP 1: STUDENT VERIFICATION DETAILS
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Enter your authentic collegiate credentials for verification at the collection counter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-pink-hot" />
            <span>STUDENT FULL NAME *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Aarav Sharma"
            {...register('fullName')}
            className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
              errors.fullName ? 'border-red-500' : 'border-[#232338] focus:border-pink-hot'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.fullName.message}</p>
          )}
        </div>

        {/* Enrollment Number */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-yellow-electric" />
            <span>COLLEGE ENROLLMENT # *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 2026CSE042"
            {...register('enrollmentNumber')}
            className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-sm text-white focus:outline-none uppercase font-mono transition-colors ${
              errors.enrollmentNumber ? 'border-red-500' : 'border-[#232338] focus:border-yellow-electric'
            }`}
          />
          {errors.enrollmentNumber && (
            <p className="text-red-400 text-xs mt-1 font-mono">
              {errors.enrollmentNumber.message}
            </p>
          )}
        </div>

        {/* College Email */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-pink-hot" />
            <span>COLLEGE EMAIL ADDRESS *</span>
          </label>
          <input
            type="email"
            placeholder="e.g. student@campus.edu"
            {...register('collegeEmail')}
            className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
              errors.collegeEmail ? 'border-red-500' : 'border-[#232338] focus:border-pink-hot'
            }`}
          />
          {errors.collegeEmail && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.collegeEmail.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-yellow-electric" />
            <span>MOBILE NUMBER (10-DIGIT INDIAN) *</span>
          </label>
          <div className="relative flex">
            <span className="inline-flex items-center px-3 text-xs font-mono bg-[#1A1A2E] text-zinc-400 border-2 border-r-0 border-[#232338]">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              {...register('phone')}
              className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-sm text-white focus:outline-none font-mono transition-colors ${
                errors.phone ? 'border-red-500' : 'border-[#232338] focus:border-yellow-electric'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.phone.message}</p>
          )}
        </div>

        {/* Department Select */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-pink-hot" />
            <span>STUDENT DEPARTMENT *</span>
          </label>
          <select
            {...register('department')}
            className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
              errors.department ? 'border-red-500' : 'border-[#232338] focus:border-pink-hot'
            }`}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.slug} value={dept.name} className="bg-[#13131F] text-white">
                {dept.name} ({dept.shortName})
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.department.message}</p>
          )}
        </div>

        {/* Academic Year and Division */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-yellow-electric" />
              <span>YEAR *</span>
            </label>
            <select
              {...register('year')}
              className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-yellow-electric px-3 py-3 text-sm text-white focus:outline-none"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">PG</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
              DIVISION (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. A"
              {...register('division')}
              className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-yellow-electric px-3 py-3 text-sm text-white focus:outline-none uppercase"
            />
          </div>
        </div>
      </div>

      {/* Info notice */}
      <div className="bg-[#181829] border-l-4 border-pink-hot p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-pink-hot shrink-0" />
        <p className="text-xs text-zinc-300">
          <strong>Duplicate Prevention:</strong> Each student enrollment number is limited to one active jersey registration. You can track existing orders via the MY ORDER tab.
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="btn-hard-pink skew-tag px-8 py-4 flex items-center gap-2 group"
        >
          <span className="skew-tag-inner font-display text-lg uppercase tracking-wider text-black flex items-center gap-2">
            <span>CONTINUE TO JERSEY DETAILS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </form>
  );
}

