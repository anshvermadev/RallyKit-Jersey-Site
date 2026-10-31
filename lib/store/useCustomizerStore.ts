import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEPARTMENTS, Department } from '@/data/departments';

export type CameraView = 'front' | 'back' | 'left' | 'right' | 'perspective';

export interface CustomizerState {
  department: Department;
  customName: string;
  jerseyNumber: number;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';
  sleeveColor: string;
  collarColor: string;
  cameraView: CameraView;
  autoRotate: boolean;
  snapshotUrl: string | null;
  
  // Actions
  setDepartment: (dept: Department) => void;
  setCustomName: (name: string) => void;
  setJerseyNumber: (num: number) => void;
  setSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL') => void;
  setSleeveColor: (color: string) => void;
  setCollarColor: (color: string) => void;
  setCameraView: (view: CameraView) => void;
  setAutoRotate: (auto: boolean) => void;
  setSnapshotUrl: (url: string | null) => void;
  resetCustomization: () => void;
}

export const useCustomizerStore = create<CustomizerState>()(
  persist(
    (set, get) => ({
      department: DEPARTMENTS[0],
      customName: 'STUDENT',
      jerseyNumber: 10,
      size: 'L',
      sleeveColor: DEPARTMENTS[0].sleeveColors[0] || DEPARTMENTS[0].secondaryColor,
      collarColor: DEPARTMENTS[0].collarColors[0] || DEPARTMENTS[0].primaryColor,
      cameraView: 'perspective',
      autoRotate: true,
      snapshotUrl: null,

      setDepartment: (dept) =>
        set({
          department: dept,
          sleeveColor: dept.sleeveColors[0] || dept.secondaryColor,
          collarColor: dept.collarColors[0] || dept.primaryColor,
        }),
      setCustomName: (name) =>
        set({
          customName: name.slice(0, 12).toUpperCase(),
        }),
      setJerseyNumber: (num) =>
        set({
          jerseyNumber: Math.max(0, Math.min(99, num)),
        }),
      setSize: (size) => set({ size }),
      setSleeveColor: (sleeveColor) => set({ sleeveColor }),
      setCollarColor: (collarColor) => set({ collarColor }),
      setCameraView: (cameraView) => set({ cameraView }),
      setAutoRotate: (autoRotate) => set({ autoRotate }),
      setSnapshotUrl: (snapshotUrl) => set({ snapshotUrl }),
      resetCustomization: () => {
        const curDept = get().department;
        set({
          customName: 'STUDENT',
          jerseyNumber: 10,
          size: 'L',
          sleeveColor: curDept.sleeveColors[0] || curDept.secondaryColor,
          collarColor: curDept.collarColors[0] || curDept.primaryColor,
          cameraView: 'perspective',
          autoRotate: true,
        });
      },
    }),
    {
      name: 'jhq-customizer-storage',
      partialize: (state) => ({
        customName: state.customName,
        jerseyNumber: state.jerseyNumber,
        size: state.size,
        sleeveColor: state.sleeveColor,
        collarColor: state.collarColor,
      }),
    }
  )
);
