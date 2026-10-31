'use client';

import React from 'react';
import JerseyModel from './JerseyModel';
import { Department } from '@/data/departments';

interface GLBJerseyProps {
  department: Department;
  customName: string;
  jerseyNumber: number;
  sleeveColor?: string;
  collarColor?: string;
  modelUrl?: string;
}

export default function SafeJerseyRenderer(props: GLBJerseyProps) {
  return <JerseyModel {...props} />;
}
