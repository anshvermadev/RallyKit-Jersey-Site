export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    number: '01',
    category: 'SIZING',
    question: 'HOW DO I CHOOSE THE RIGHT JERSEY SIZE?',
    answer: 'Our jerseys have an authentic esports athletic fit. We offer sizes from XS through 3XL. Refer to our interactive Size Chart modal on any jersey customizer page for precise chest, shoulder, and length measurements in inches and cm. If you prefer a loose oversized collegiate streetwear vibe, we recommend ordering one size up.',
  },
  {
    id: 'faq-2',
    number: '02',
    category: 'DEADLINE',
    question: 'WHEN IS THE REGISTRATION DEADLINE FOR BATCH 2026?',
    answer: 'Pre-orders for the 2026 Batch close strictly on Friday, November 14th at 11:59 PM IST. After this cutoff, production begins immediately at our sublimation printing unit. Late submissions cannot be guaranteed before College Rivals Week.',
  },
  {
    id: 'faq-3',
    number: '03',
    category: 'CUSTOMIZATION',
    question: 'CAN I MODIFY MY CUSTOM NAME OR JERSEY NUMBER LATER?',
    answer: 'You can update your customized back name (up to 12 letters) and jersey number (0-99) within 24 hours of placing the order by visiting the "MY ORDER" tracking page and clicking "Request Edit", or by reaching out to your Department Student Rep with your Order ID.',
  },
  {
    id: 'faq-4',
    number: '04',
    category: 'COLLECTION',
    question: 'WHERE AND WHEN DO I COLLECT MY PHYSICAL JERSEY?',
    answer: 'Collection will take place at the Student Activity Center (SAC), Ground Floor Counter 4. Dates will be announced via campus email and SMS. To claim your kit, simply show your digital QR code on your mobile phone from the order confirmation page.',
  },
  {
    id: 'faq-5',
    number: '05',
    category: 'CANCELLATION',
    question: 'WHAT IS THE REFUND & EXCHANGE POLICY?',
    answer: 'Because jerseys are custom sublimation-printed with your unique student name and number, registrations cannot be refunded once printing starts. However, in the rare event of a manufacturing defect, damaged seams, or incorrect size shipment, we offer a free 1-to-1 immediate replacement on collection day.',
  },
  {
    id: 'faq-6',
    number: '06',
    category: 'PAYMENTS',
    question: 'HOW DOES DEMO PAYMENT WORK & WILL I BE BILLED?',
    answer: 'This is an official interactive DEMO sandbox portal. NO REAL MONEY is charged to your card or UPI account. You can test UPI (Google Pay, PhonePe, Paytm), Card, or Cash-On-Collection in Demo Mode to receive an authentic simulated receipt and collection QR pass.',
  },
];
