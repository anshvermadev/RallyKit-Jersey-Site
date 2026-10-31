# ⚡ JERSEY HQ — Official Collegiate 3D Jersey Portal

An esports-grade, production-quality interactive 3D merchandise and jersey registration web application inspired by the loud, high-energy layout language of **College Rivals**. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Three.js via React Three Fiber & Drei, Zustand, and Zod.

---

## 🚀 Key Features

- **🎮 High-Octane College Rivals Theme**:
  - Near-black palette (`#0B0B12`) with subtle noise/grain texture overlay.
  - Hot Pink (`#FF2E93`) and Electric Yellow (`#FFE600`) poster accents.
  - Heavy condensed italic display typography, sticker badges, slanted buttons, and hard offset drop shadows (`4px 4px 0px 0px`).
- **🎽 Interactive 3D Jersey Viewer (WebGL / Three.js)**:
  - Powered by `@react-three/fiber` and `@react-three/drei`.
  - Realistic procedural 3D athletic cut mesh with dynamic torso, sleeves, collar trim, and front crest.
  - Model-agnostic GLB loader architecture (`/public/models/jersey.glb`) mapping materials dynamically by name.
  - **Live Back Customization**: Instant 3D rendering of student player name (up to 12 chars, A-Z) and jersey number (0–99).
  - OrbitControls with clamped zoom, auto-rotation with touch pause, and instant Front / Back / Left / Right / Reset snap camera tweens.
  - Studio lighting setup: environment map, soft ContactShadows, and signature hot-pink rim light.
  - Graceful reactive 2D SVG fallback if WebGL is unavailable.
- **📋 Multi-Step Registration Flow (`/register`)**:
  - **Step 1: Student Details** (Name, enrollment number, college email, 10-digit Indian mobile, branch, year, division).
  - **Step 2: Jersey Customization** (Branch jersey confirmation, back player name, squad number, size XS–3XL, quantity 1–3, fit notes).
  - **Step 3: Review** (Visual snapshot, itemized pricing breakdown).
  - **Step 4: Demo Payment** (Simulated UPI, Credit/Debit card, and Cash-on-collection options, 2-second processing animation, and developer failure-simulation toggle).
  - Client & Server Zod schema validation.
  - Duplicate enrollment number protection.
  - Auto-saving draft stored in browser `localStorage`.
- **🎟️ Digital Pass & Confirmation (`/order/[id]`)**:
  - Confetti burst celebration on success.
  - Unique Order ID (e.g. `JRS-2026-0001`).
  - Interactive collection pass with high-density QR code for instant SAC Counter 4 scanning.
  - Printable receipt / collection pass via browser print styles (`window.print()`).
- **📍 Live Order Status Tracker (`/my-order`)**:
  - Authentication-free lookup using college enrollment number + email.
  - 5-stage production timeline: `Registered` → `Paid` → `Printing` → `Ready` → `Collected`.
- **🛡️ Admin Operations Dashboard (`/admin`)**:
  - Passcode-gated demo portal (Default: `admin123`).
  - Real-time summary statistics: total registrations, revenue, branch volume.
  - Size distribution visual analytics powered by **Recharts**.
  - Interactive registration roster with live status updates (syncs to server via Route Handlers).
  - Instant One-Click CSV Export for manufacturing dispatch.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | Next.js 14+ (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS 3.4, PostCSS, Custom Design Tokens |
| **3D Engine** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Animation** | Framer Motion, CSS Marquee / GSAP keyframes |
| **Forms & Validation** | React Hook Form, `@hookform/resolvers`, Zod |
| **State Management** | Zustand (with `persist` middleware for drafts) |
| **Analytics & Charts** | Recharts |
| **QR & Confetti** | `qrcode.react`, `canvas-confetti` |
| **Persistence** | Data repository layer backed by JSON file / in-memory store |

---

## 📁 Project Directory Structure

```
Alkemy Jersey Web/
├── app/
│   ├── (site)/
│   ├── api/
│   │   ├── admin/orders/route.ts      # GET / PATCH orders (passcode protected)
│   │   ├── orders/[id]/route.ts       # GET single order by ID
│   │   ├── orders/lookup/route.ts     # POST lookup by enrollment number
│   │   ├── payment/demo/route.ts      # POST simulated payment verification
│   │   └── register/route.ts          # POST create registration with zod validation
│   ├── admin/page.tsx                 # Admin dashboard with password gate & Recharts
│   ├── jerseys/page.tsx               # Branch catalog listing with filters
│   ├── jerseys/[slug]/page.tsx        # 3D Viewer & live customizer panel
│   ├── my-order/page.tsx              # Order status tracking portal
│   ├── order/[id]/page.tsx            # Success confirmation, QR pass & receipt
│   ├── register/page.tsx              # 4-step registration stepper
│   ├── globals.css                    # Design tokens, grain overlay, poster utilities
│   ├── layout.tsx                     # Global layout, sticky navbar & footer
│   └── page.tsx                       # Homepage mirroring College Rivals structure
├── components/
│   ├── forms/
│   │   ├── Step1StudentDetails.tsx    # Student info form with zod validation
│   │   ├── Step2JerseyDetails.tsx    # Jersey custom specs & size selection
│   │   ├── Step3OrderReview.tsx      # Order review & price breakdown
│   │   └── Step4DemoPayment.tsx      # Simulated gateway with dev toggle
│   ├── home/
│   │   ├── Hero.tsx                   # Full viewport hero with live 3D jersey
│   │   ├── StatsStrip.tsx             # Animated count-up counters
│   │   ├── DepartmentSlider.tsx       # Horizontal pink card slider
│   │   ├── Marquee.tsx                # Infinite campus ticker
│   │   ├── Highlights.tsx             # Photo carousel recap
│   │   ├── HowItWorks.tsx             # 4-step progress flow
│   │   ├── Announcements.tsx          # News dispatch list
│   │   ├── FAQSection.tsx             # Numbered expandable accordion (01-06)
│   │   └── FinalCTA.tsx               # "JOIN THE SQUAD !!" banner
│   ├── jersey/
│   │   ├── CameraController.tsx       # OrbitControls + snap camera tweens
│   │   ├── CustomizerPanel.tsx        # Live back name/number/size customizer
│   │   ├── GLBJerseyModel.tsx         # Model-agnostic GLB material mapper
│   │   ├── JerseyCanvas.tsx           # R3F canvas, lighting, controls & fallbacks
│   │   ├── JerseyModel.tsx            # Procedural 3D athletic jersey mesh
│   │   └── SizeChartModal.tsx         # Interactive size guide (inches & cm)
│   └── layout/
│       ├── Footer.tsx                 # Links, socials, and demo disclaimers
│       └── Navbar.tsx                 # Sticky navigation & mobile animated drawer
├── data/
│   ├── departments.ts                 # 8 branch configurations (colors, prices, sizes)
│   ├── faq.ts                         # Sizing, deadlines, pickup, payments FAQ
│   ├── news.ts                        # Local announcement items
│   └── orders.json                    # File-backed orders persistence
├── lib/
│   ├── config.ts                      # Central site configuration constant
│   ├── payment/
│   │   ├── demo.ts                    # DemoPaymentProvider implementation
│   │   └── types.ts                   # PaymentProvider interface
│   ├── repositories/
│   │   └── orders.ts                  # OrderRepository interface & local JSON backend
│   ├── store/
│   │   ├── useCustomizerStore.ts      # 3D canvas state & camera views
│   │   └── useRegistrationStore.ts    # Multi-step draft store with localStorage
│   └── validators/
│       └── order.ts                   # Zod validation schemas
├── public/
│   ├── logos/                         # Branch SVG shield insignias
│   └── models/                        # Target directory for custom jersey.glb
└── tailwind.config.ts                 # Poster theme colors, box shadows & keyframes
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: `v18.18+` or `v20+` or `v24+`
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### 2. Installation
```bash
git clone <repo-url>
cd "Alkemy Jersey Web"
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root:
```env
# Admin Portal Passcode (Defaults to 'admin123' if omitted)
ADMIN_PASSCODE=admin123

# Node Environment
NODE_ENV=development
```

### 4. Running Locally
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Customization & Extension Guides

### 1. How to Rename the Site
Open [`lib/config.ts`](file:///d:/Alkemy%20Jersey%20Web/lib/config.ts):
```ts
export const SITE_CONFIG = {
  name: 'JERSEY HQ',           // Change to e.g. 'RIVALS ARENA' or 'TITAN KITS'
  shortName: 'JHQ',
  collegeName: 'CAMPUS LEAGUE 2026',
  batch: 'BATCH 2026',
  collectionVenue: 'Student Activity Center, Counter 4',
  ...
};
```
Every page, navbar, receipt, and metadata title automatically updates from this single config.

---

### 2. How to Swap the 3D Model with a Custom GLB

The application is completely **model-agnostic**. By default, it renders a procedural athletic-cut jersey with collar ribs and front chest badges.

To load your own 3D artist `.glb` or `.gltf` asset:
1. Export your jersey model as a binary glTF (`jersey.glb`).
2. Optimize and compress it using Draco or Meshopt:
   ```bash
   npx gltf-pipeline -i input.glb -o public/models/jersey.glb -d
   ```
3. Ensure your 3D mesh material names use standard naming:
   - Body/torso meshes named with `body`, `torso`, or `primary`.
   - Sleeve meshes named with `sleeve` or `secondary`.
   - Collar/trim meshes named with `collar`, `trim`, or `accent`.
4. Place the file at:
   ```
   public/models/jersey.glb
   ```
5. [`components/jersey/GLBJerseyModel.tsx`](file:///d:/Alkemy%20Jersey%20Web/components/jersey/GLBJerseyModel.tsx) will load it via `useGLTF('/models/jersey.glb')` and automatically apply the department's colors and custom back text!

---

### 3. How to Add a New Department

Open [`data/departments.ts`](file:///d:/Alkemy%20Jersey%20Web/data/departments.ts) and append to the `DEPARTMENTS` array:
```ts
{
  slug: 'aero',
  name: 'Aerospace Engineering',
  shortName: 'AERO',
  tagline: 'SUPERSONIC VELOCITY. REACH ESCAPE.',
  description: 'Stealth matte carbon with aerodynamic supersonic orange flight trails.',
  primaryColor: '#0F172A',
  secondaryColor: '#FF5722',
  accentColor: '#FFE600',
  sleeveColors: ['#FF5722', '#0F172A', '#FFFFFF'],
  collarColors: ['#FFE600', '#FF5722', '#000000'],
  basePrice: 599,
  badgeText: 'NEW DROP',
  batch: 'BATCH 2026',
  availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  logoPath: '/logos/aero.svg',
  pattern: 'speed-slash',
  stats: {
    registeredCount: 42,
    rating: 4.9,
  },
}
```
The new department will automatically populate in:
- Homepage Hero and Department Slider
- `/jerseys` catalog grid with filters
- `/jerseys/aero` 3D viewer & customizer
- Registration branch dropdowns and admin analytics

---

### 4. How to Replace `DemoPaymentProvider` with Razorpay

All payment logic is decoupled behind the `PaymentProvider` interface in [`lib/payment/types.ts`](file:///d:/Alkemy%20Jersey%20Web/lib/payment/types.ts).

To drop in Razorpay:
1. Install Razorpay:
   ```bash
   pnpm add razorpay
   ```
2. Create `lib/payment/razorpay.ts`:
   ```ts
   import Razorpay from 'razorpay';
   import crypto from 'crypto';
   import { PaymentProvider, CreatePaymentParams, VerifyPaymentParams, PaymentResult } from './types';

   export class RazorpayPaymentProvider implements PaymentProvider {
     name = 'Razorpay';
     private instance: Razorpay;

     constructor() {
       this.instance = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID!,
         key_secret: process.env.RAZORPAY_KEY_SECRET!,
       });
     }

     async createPayment(params: CreatePaymentParams) {
       const order = await this.instance.orders.create({
         amount: Math.round(params.amount * 100), // paise
         currency: 'INR',
         receipt: params.orderId,
       });

       return {
         paymentId: order.id,
         amount: params.amount,
         currency: 'INR',
         providerData: { orderId: order.id },
       };
     }

     async verifyPayment(params: VerifyPaymentParams): Promise<PaymentResult> {
       const text = `${params.orderId}|${params.transactionId}`;
       const expected = crypto
         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
         .update(text)
         .digest('hex');

       const isValid = expected === params.signature;
       return {
         success: isValid,
         transactionId: params.transactionId,
         orderId: params.orderId,
         amount: 599,
         method: 'RAZORPAY',
         message: isValid ? 'Payment verified' : 'Signature mismatch',
         timestamp: new Date().toISOString(),
       };
     }
   }
   ```
3. Update `currentPaymentProvider` in [`lib/payment/demo.ts`](file:///d:/Alkemy%20Jersey%20Web/lib/payment/demo.ts) to instantiate `RazorpayPaymentProvider()`.

---

### 5. Deployment on Vercel

This application is built for seamless, zero-config deployment on **Vercel**:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/new), select your repository.
3. Keep the default Next.js build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm run build` or `npm run build`
   - **Output Directory**: `.next`
4. Add environment variables in the Vercel project settings:
   - `ADMIN_PASSCODE` = `your_secure_passcode`
5. Click **Deploy**. Vercel will build all static pages and deploy the Route Handlers to Serverless Edge infrastructure.

---

## 🔒 Demo Mode Notice

This web application operates strictly in **DEMO SIMULATION MODE**. No monetary charges are billed to any bank, card, or UPI account. All payment receipts, transaction identifiers, and SAC pickup passes are generated for university demonstration and student portal testing purposes.

---

## 📄 License
MIT © 2026 JERSEY HQ. All rights reserved.
