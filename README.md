# RallyKit — ALKEMY 2027 Department Jersey Collection

A single-page website for ordering ALKEMY 2027 department jerseys (CSE, AIML, CSBS, IT, EXTC). Students can rotate each jersey in 3D, put their name and number on the back with a live preview, check out, and get a printed receipt.

> **Demo build.** Payments are simulated and orders are saved only in the visitor's own browser (`localStorage`). Nothing is charged, sent or stored on a server.

## Features

- **Landing page**: a 3D jersey carousel (drag, arrow keys, autoplay), a scroll-pinned "Fabric & Fit" section that flips the jersey, a shop grid, and a squad kit builder.
- **Product page** (`#/jersey/<dept>`): 360° drag-to-rotate, zoom, front/back toggle, and department and size (XS–XXL) selection.
- **Live customisation**: the name and number are painted onto the 3D jersey's back as you type.
- **Checkout** (`#/checkout`): details → review → payment.
  - Validates name, email, 10-digit mobile, Aadhaar (12 digits plus its checksum, with consent), PRN, department, year, size, number (0–99), printed name and quantity.
  - The amount is filled in automatically.
- **Demo payment**: UPI (QR, UPI ID, optional reference number and screenshot) or card (card-number check, expiry, CVV).
- **Confirmation** (`#/order/<id>`): an animated receipt printer, a receipt viewer, and a **PDF download** (vector PDF, generated in the browser).
- Responsive (phone layout below 820px), and respects reduced-motion settings.

## Project structure

```
index.html              the whole site (HTML, CSS, JS module)
shared/validate.js      checkout form checks (Aadhaar checksum, phone, PRN…)
assets/jersey.glb       3D jersey (fitted, cloth-draped); artwork recoloured per department at runtime
assets/jerseys/*.png    jersey photos — fallback if the 3D model can't load
_headers                Netlify caching / content-type headers
tools/build_jersey.py   rebuilds assets/jersey.glb from the flat source model (cloth simulation)
tools/jersey-source-extc.glb   flat source model used by build_jersey.py
tools/prep_assets.py    one-off prep of the jersey photos
```

## Run locally

It needs a local web server, because browsers block loading the 3D model and photos from `file://`.

```bash
python -m http.server 8080      # then open http://localhost:8080
# or
npx serve .
```

Useful URLs:

- `/#/jersey/aiml`: product page for a department
- `/?debug=cut`: shows every department's front and back render on one page

## Deploy (Netlify)

Zip `index.html`, `_headers`, `assets/` and `shared/`, then drag the zip onto **Netlify → Add new site → Deploy manually** (or onto **Deploys** to update an existing site). No build step or redirects are needed, because all page routes use `#/…`.

The site loads Three.js and the fonts from `cdn.jsdelivr.net` and Google Fonts.

## Configuration (in `index.html`)

| Setting | What it controls |
|---|---|
| `DESIGNS` | Departments, jersey colours and accent colours |
| `PRICE` | Price per jersey (₹, currently a placeholder) |
| `SQUAD_DISCOUNT`, `KIT_SLOTS` | Squad kit builder |
| `RECEIPT` | Receipt header lines (event, institution, footer) |
| `ART` | Where department names, badge, wordmark, event text and back print sit on the jersey artwork |
| `GLB` | 3D model path; append `?glb=other.glb` to the URL to try another model |

## Rebuild the 3D jersey

```bash
pip install numpy
python tools/build_jersey.py tools/jersey-source-extc.glb assets/jersey.glb
```

This sews the source model's front and back panels together around an invisible mannequin, fits them snugly, and writes the GLB with the original UVs and textures. It takes about 3–4 minutes.

## Going live with real orders

Real orders need a small backend. It would:

- create the order on the server
- verify payment with the gateway (e.g. Razorpay: order + signature check + payment fetch, webhook as backup)
- store orders
- send confirmation emails

Reuse `shared/validate.js` for server-side validation. Then remove the demo banners and the "DEMO" receipt watermark.

**Aadhaar:** collecting Aadhaar numbers is legally restricted in India (Aadhaar Act / UIDAI rules). Confirm it is really needed. If it is, store only the masked number, as this demo does.
