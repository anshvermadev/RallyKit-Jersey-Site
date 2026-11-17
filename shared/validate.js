// Order validation for the checkout form (frontend demo — swap in server-side validation when going live).
// Plain ES module, no dependencies.

export const DEPARTMENTS = [
  { code: 'cse', label: 'CSE' },
  { code: 'aiml', label: 'AIML' },
  { code: 'csbs', label: 'CSBS' },
  { code: 'it', label: 'IT' },
  { code: 'extc', label: 'EXTC' },
];
export const YEARS = ['FY', 'SY', 'TY', 'BE'];
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const LIMITS = { printNameMax: 12, qtyMin: 1, qtyMax: 5 };

/** Jersey print name: capitals, spaces and . ' - only, max 12 characters. */
export const cleanPrintName = s => String(s ?? '').toUpperCase().replace(/[^A-Z .'-]/g, '').replace(/\s+/g, ' ').slice(0, LIMITS.printNameMax);
/** Jersey number: up to two digits (0–99, "07" allowed). */
export const cleanNumber = s => String(s ?? '').replace(/\D/g, '').slice(0, 2);
export const digits = s => String(s ?? '').replace(/\D/g, '');

// Verhoeff checksum (used by Aadhaar's last digit)
const VD = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const VP = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
export function verhoeffValid(num) {
  let c = 0; const a = String(num).split('').reverse().map(Number);
  for (let i = 0; i < a.length; i++) c = VD[c][VP[i % 8][a[i]]];
  return c === 0;
}
export const maskAadhaar = a => `XXXX XXXX ${digits(a).slice(-4)}`;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate + normalise an order. Returns { ok, errors: {field: message}, value }.
 * Field names match the checkout form's `name` attributes.
 */
export function validateOrder(input = {}) {
  const e = {}, v = {};
  const str = k => String(input[k] ?? '').trim();

  v.fullName = str('fullName').replace(/\s+/g, ' ');
  if (!v.fullName) e.fullName = 'Enter your full name.';
  else if (v.fullName.length < 2 || v.fullName.length > 80 || !/^[\p{L} .'-]+$/u.test(v.fullName)) e.fullName = 'Use letters, spaces, . \' or - only.';

  v.email = str('email').toLowerCase();
  if (!v.email) e.email = 'Enter your email address.';
  else if (v.email.length > 120 || !EMAIL.test(v.email)) e.email = 'Enter a valid email address.';

  v.phone = digits(input.phone);
  if (!v.phone) e.phone = 'Enter your mobile number.';
  else if (!/^[6-9]\d{9}$/.test(v.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';

  const aadhaar = digits(input.aadhaar);
  if (!aadhaar) e.aadhaar = 'Enter your 12-digit Aadhaar number.';
  else if (!/^[2-9]\d{11}$/.test(aadhaar) || !verhoeffValid(aadhaar)) e.aadhaar = 'That isn’t a valid Aadhaar number.';
  v.aadhaar = aadhaar;

  if (input.aadhaarConsent !== true && input.aadhaarConsent !== 'true' && input.aadhaarConsent !== 'on') e.aadhaarConsent = 'Please confirm consent to proceed.';
  v.aadhaarConsent = !e.aadhaarConsent;

  v.prn = str('prn').toUpperCase();
  if (!v.prn) e.prn = 'Enter your PRN / roll number.';
  else if (!/^[A-Z0-9/-]{3,20}$/.test(v.prn)) e.prn = 'Use 3–20 letters, digits, / or -.';

  v.department = str('department').toLowerCase();
  if (!DEPARTMENTS.some(d => d.code === v.department)) e.department = 'Choose your department.';

  v.year = str('year').toUpperCase();
  if (!YEARS.includes(v.year)) e.year = 'Choose your year.';

  v.size = str('size').toUpperCase();
  if (!SIZES.includes(v.size)) e.size = 'Choose a jersey size.';

  v.number = cleanNumber(input.number);
  if (v.number === '' || String(input.number ?? '').trim() !== v.number) e.number = 'Enter a number from 0 to 99.';

  v.printName = cleanPrintName(input.printName).trim();
  if (!v.printName) e.printName = 'Enter the name to print on the back.';
  else if (String(input.printName ?? '').trim().toUpperCase() !== v.printName || !/[A-Z]/.test(v.printName)) e.printName = 'Letters, spaces, . \' or - only (max 12).';

  v.qty = Number.parseInt(input.qty, 10);
  if (!Number.isInteger(v.qty) || v.qty < LIMITS.qtyMin || v.qty > LIMITS.qtyMax) e.qty = `Quantity must be ${LIMITS.qtyMin}–${LIMITS.qtyMax}.`;

  return { ok: Object.keys(e).length === 0, errors: e, value: v };
}

export const isUtr = s => /^\d{12}$/.test(digits(s));
