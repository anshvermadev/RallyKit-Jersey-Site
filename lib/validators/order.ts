import { z } from 'zod';

export const StudentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(60, 'Full name cannot exceed 60 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Full name should only contain letters and spaces'),
  enrollmentNumber: z
    .string()
    .min(5, 'Enrollment number is required (min 5 chars)')
    .max(20, 'Enrollment number is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Enrollment must be alphanumeric'),
  collegeEmail: z
    .string()
    .email('Please provide a valid college email address')
    .min(5, 'Email required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  department: z
    .string()
    .min(1, 'Please select your department'),
  year: z
    .string()
    .min(1, 'Please select your academic year'),
  division: z
    .string()
    .max(10, 'Division should not exceed 10 characters')
    .optional(),
});

export const JerseyCustomizationSchema = z.object({
  departmentSlug: z.string().min(1, 'Department slug is required'),
  departmentName: z.string().min(1, 'Department name is required'),
  customName: z
    .string()
    .min(1, 'Custom name on back is required')
    .max(12, 'Maximum 12 characters allowed')
    .regex(/^[A-Za-z0-9_\s-]+$/, 'Only letters, numbers, and hyphens/underscores allowed')
    .transform((val) => val.toUpperCase()),
  jerseyNumber: z
    .coerce
    .number()
    .int('Jersey number must be an integer')
    .min(0, 'Jersey number must be between 0 and 99')
    .max(99, 'Jersey number must be between 0 and 99'),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'], {
    errorMap: () => ({ message: 'Please select a valid size' }),
  }),
  sleeveColor: z.string().optional(),
  collarColor: z.string().optional(),
  quantity: z
    .coerce
    .number()
    .int()
    .min(1, 'Minimum 1 jersey')
    .max(3, 'Maximum 3 jerseys per registration'),
  notes: z
    .string()
    .max(200, 'Notes cannot exceed 200 characters')
    .optional(),
  thumbnailSnapshot: z.string().optional(),
});

export const DemoPaymentFormSchema = z.object({
  method: z.enum(['upi', 'card', 'cash']),
  upiId: z
    .string()
    .optional()
    .refine((val) => !val || /^[\w.-]+@[\w.-]+$/.test(val), {
      message: 'Please enter a valid UPI ID (e.g. username@okhdfcbank)',
    }),
  cardNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(val.replace(/\s+/g, '')), {
      message: 'Enter 16 digits (e.g. 4242 4242 4242 4242)',
    }),
  cardExpiry: z
    .string()
    .optional()
    .refine((val) => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
      message: 'Format MM/YY',
    }),
  cardCvv: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{3,4}$/.test(val), {
      message: 'Enter 3 or 4 digit CVV',
    }),
  simulateFailure: z.boolean().optional(),
});

export const CreateOrderRequestSchema = z.object({
  student: StudentSchema,
  jersey: JerseyCustomizationSchema,
  paymentMethod: z.enum(['upi', 'card', 'cash']),
  simulateFailure: z.boolean().optional(),
  clientPaymentRef: z.string().optional(),
});

export const OrderLookupSchema = z.object({
  enrollmentNumber: z.string().min(3, 'Enrollment number is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
});

export type StudentFormData = z.infer<typeof StudentSchema>;
export type JerseyCustomizationData = z.infer<typeof JerseyCustomizationSchema>;
export type DemoPaymentFormData = z.infer<typeof DemoPaymentFormSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type OrderLookupRequest = z.infer<typeof OrderLookupSchema>;
