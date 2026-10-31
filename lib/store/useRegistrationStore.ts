import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudentFormData, JerseyCustomizationData } from '@/lib/validators/order';

export interface RegistrationStoreState {
  currentStep: number;
  studentData: Partial<StudentFormData>;
  jerseyData: Partial<JerseyCustomizationData>;
  paymentMethod: 'upi' | 'card' | 'cash';
  simulateFailure: boolean;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStudentData: (data: Partial<StudentFormData>) => void;
  setJerseyData: (data: Partial<JerseyCustomizationData>) => void;
  setPaymentMethod: (method: 'upi' | 'card' | 'cash') => void;
  setSimulateFailure: (val: boolean) => void;
  clearDraft: () => void;
}

const defaultStudent: Partial<StudentFormData> = {
  fullName: '',
  enrollmentNumber: '',
  collegeEmail: '',
  phone: '',
  department: '',
  year: '1st Year',
  division: 'A',
};

const defaultJersey: Partial<JerseyCustomizationData> = {
  departmentSlug: 'cse',
  departmentName: 'Computer Science & Engineering',
  customName: 'STUDENT',
  jerseyNumber: 10,
  size: 'L',
  quantity: 1,
  notes: '',
};

export const useRegistrationStore = create<RegistrationStoreState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      studentData: defaultStudent,
      jerseyData: defaultJersey,
      paymentMethod: 'upi',
      simulateFailure: false,

      setStep: (step) => set({ currentStep: Math.max(1, Math.min(4, step)) }),
      nextStep: () => set({ currentStep: Math.min(4, get().currentStep + 1) }),
      prevStep: () => set({ currentStep: Math.max(1, get().currentStep - 1) }),

      setStudentData: (data) =>
        set((state) => ({
          studentData: { ...state.studentData, ...data },
        })),

      setJerseyData: (data) =>
        set((state) => ({
          jerseyData: { ...state.jerseyData, ...data },
        })),

      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setSimulateFailure: (simulateFailure) => set({ simulateFailure }),

      clearDraft: () =>
        set({
          currentStep: 1,
          studentData: defaultStudent,
          jerseyData: defaultJersey,
          paymentMethod: 'upi',
          simulateFailure: false,
        }),
    }),
    {
      name: 'jhq-registration-draft',
    }
  )
);

