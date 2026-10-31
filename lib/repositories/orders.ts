import fs from 'fs';
import path from 'path';

export interface OrderStudent {
  fullName: string;
  enrollmentNumber: string;
  collegeEmail: string;
  phone: string;
  department: string;
  year: string;
  division?: string;
}

export interface OrderJersey {
  departmentSlug: string;
  departmentName: string;
  customName: string;
  jerseyNumber: number;
  size: string;
  sleeveColor?: string;
  collarColor?: string;
  quantity: number;
  notes?: string;
  thumbnailSnapshot?: string; // Data URL or placeholder
}

export interface OrderPricing {
  basePrice: number;
  customizationFee: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface OrderPayment {
  method: 'upi' | 'card' | 'cash';
  status: 'pending' | 'paid' | 'failed';
  transactionId: string;
  paidAt?: string;
  demoDetails?: {
    gatewayRef?: string;
    cardLast4?: string;
    upiVpa?: string;
  };
}

export type OrderStatus = 'Registered' | 'Paid' | 'Printing' | 'Ready' | 'Collected';

export interface Order {
  id: string; // e.g. JRS-2026-0001
  createdAt: string;
  updatedAt: string;
  student: OrderStudent;
  jersey: OrderJersey;
  pricing: OrderPricing;
  payment: OrderPayment;
  status: OrderStatus;
}

export interface OrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  findByEnrollmentOrEmail(enrollmentNumber: string, email?: string): Promise<Order[]>;
  create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  updatePayment(id: string, payment: Partial<OrderPayment>): Promise<Order | null>;
}

// In-memory + File-backed JSON repository implementation
const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Default initial seed data for demo showcasing
const INITIAL_ORDERS: Order[] = [
  {
    id: 'JRS-2026-0001',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    student: {
      fullName: 'Aarav Sharma',
      enrollmentNumber: '2026CSE042',
      collegeEmail: 'aarav.sharma@campus.edu',
      phone: '9876543210',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      division: 'A',
    },
    jersey: {
      departmentSlug: 'cse',
      departmentName: 'Computer Science & Engineering',
      customName: 'SHARMA_X',
      jerseyNumber: 7,
      size: 'L',
      sleeveColor: '#00F0FF',
      collarColor: '#FFE600',
      quantity: 1,
      notes: 'Need standard fit',
    },
    pricing: {
      basePrice: 599,
      customizationFee: 0,
      quantity: 1,
      discount: 0,
      total: 599,
    },
    payment: {
      method: 'upi',
      status: 'paid',
      transactionId: 'UPI-DEMO-991283',
      paidAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      demoDetails: { upiVpa: 'aarav@okaxis' },
    },
    status: 'Printing',
  },
  {
    id: 'JRS-2026-0002',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    student: {
      fullName: 'Priya Patel',
      enrollmentNumber: '2026AIML018',
      collegeEmail: 'priya.patel@campus.edu',
      phone: '9812345678',
      department: 'Artificial Intelligence & Data Science',
      year: '2nd Year',
      division: 'B',
    },
    jersey: {
      departmentSlug: 'aiml',
      departmentName: 'Artificial Intelligence & Data Science',
      customName: 'CYBER_PRIYA',
      jerseyNumber: 21,
      size: 'M',
      sleeveColor: '#FFE600',
      collarColor: '#8A2BE2',
      quantity: 1,
    },
    pricing: {
      basePrice: 599,
      customizationFee: 0,
      quantity: 1,
      discount: 0,
      total: 599,
    },
    payment: {
      method: 'card',
      status: 'paid',
      transactionId: 'CRD-DEMO-558291',
      paidAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      demoDetails: { cardLast4: '4242' },
    },
    status: 'Ready',
  },
  {
    id: 'JRS-2026-0003',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    student: {
      fullName: 'Rohan Deshmukh',
      enrollmentNumber: '2026MECH104',
      collegeEmail: 'rohan.mech@campus.edu',
      phone: '9765432109',
      department: 'Mechanical Engineering',
      year: '4th Year',
      division: 'A',
    },
    jersey: {
      departmentSlug: 'mech',
      departmentName: 'Mechanical Engineering',
      customName: 'TORQUE_RO',
      jerseyNumber: 99,
      size: 'XL',
      sleeveColor: '#FFE600',
      collarColor: '#FF6D00',
      quantity: 1,
    },
    pricing: {
      basePrice: 599,
      customizationFee: 0,
      quantity: 1,
      discount: 0,
      total: 599,
    },
    payment: {
      method: 'cash',
      status: 'pending',
      transactionId: 'CSH-DEMO-102941',
    },
    status: 'Registered',
  },
];

class LocalFileOrderRepository implements OrderRepository {
  private cache: Order[] | null = null;

  private load(): Order[] {
    if (this.cache) return this.cache;
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
        return this.cache!;
      }
    } catch {
      // Fallback
    }
    this.cache = [...INITIAL_ORDERS];
    this.save();
    return this.cache;
  }

  private save(): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist orders to disk; using in-memory store:', e);
    }
  }

  async getAll(): Promise<Order[]> {
    return [...this.load()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<Order | null> {
    const list = this.load();
    return list.find((o) => o.id.toUpperCase() === id.toUpperCase()) || null;
  }

  async findByEnrollmentOrEmail(enrollmentNumber: string, email?: string): Promise<Order[]> {
    const list = this.load();
    const cleanEnroll = enrollmentNumber.trim().toUpperCase();
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    return list.filter((o) => {
      const matchEnroll = o.student.enrollmentNumber.toUpperCase() === cleanEnroll;
      const matchEmail = cleanEmail ? o.student.collegeEmail.toLowerCase() === cleanEmail : false;
      return matchEnroll || matchEmail;
    });
  }

  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const list = this.load();
    const nextSeq = list.length + 1;
    const padded = String(nextSeq).padStart(4, '0');
    const id = `JRS-2026-${padded}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newOrder);
    this.save();
    return newOrder;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const list = this.load();
    const order = list.find((o) => o.id.toUpperCase() === id.toUpperCase());
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  async updatePayment(id: string, payment: Partial<OrderPayment>): Promise<Order | null> {
    const list = this.load();
    const order = list.find((o) => o.id.toUpperCase() === id.toUpperCase());
    if (!order) return null;
    order.payment = {
      ...order.payment,
      ...payment,
    };
    if (payment.status === 'paid' && order.status === 'Registered') {
      order.status = 'Paid';
    }
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }
}

// Export singleton repository
export const orderRepository: OrderRepository = new LocalFileOrderRepository();

