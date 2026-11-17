"""One-off asset prep: copy source photos into assets/jerseys with spec names,
convert webp->png, and split the ExTc front/back photo along a dark seam.
Usage: python tools/prep_assets.py <source_images_dir> <out_dir>"""
import sys, os
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
MAP = {"5.png": "01-cse-front.png", "4.png": "02-it-front.png",
       "3.webp": "03-csbs-front.png", "2.png": "04-aiml-front.png"}
for s, d in MAP.items():
    Image.open(os.path.join(src, s)).convert("RGB").save(os.path.join(out, d))

im = Image.open(os.path.join(src, "1.png")).convert("RGB")
# The two hangers overlap: the front's right sleeve sits in front of the back's
# left sleeve. Hand-traced polygon (source px, 1344x896) following that edge.
FRONT_POLY = [(0, 0), (712, 0), (712, 150), (668, 262), (676, 298), (723, 381),
              (655, 452), (718, 520), (718, 896), (0, 896)]
from PIL import ImageDraw
import numpy as np
mask = Image.new("L", im.size, 0)
ImageDraw.Draw(mask).polygon(FRONT_POLY, fill=255)
# Fill the removed half with a smooth backdrop estimate (not pure black) so the runtime
# cut, which models the backdrop, doesn't mistake the split edge for jersey.
a = np.asarray(im).astype(np.float64)
L = a @ [0.299, 0.587, 0.114]; S = a.max(2) - a.min(2)
h, w = L.shape
yy, xx = np.mgrid[0:h, 0:w]; u = xx / w - .5; v = yy / h - .5
T = np.stack([np.ones_like(u), u, v, u*u, v*v, u*v, u**3, v**3], -1)
bgpx = (L < 40) & (S < 7)
coef = np.linalg.lstsq(T[bgpx][::7], L[bgpx][::7], rcond=None)[0]
for _ in range(2):
    res = np.abs(T @ coef - L); sel = bgpx & (res < 5)
    coef = np.linalg.lstsq(T[sel][::7], L[sel][::7], rcond=None)[0]
bg = np.clip(T @ coef, 0, 255)[..., None].repeat(3, 2)
m = (np.asarray(mask) > 0)[..., None]
Image.fromarray(np.where(m, a, bg).astype(np.uint8)).save(os.path.join(out, "05-extc-front.png"))
Image.fromarray(np.where(m, bg, a).astype(np.uint8)).save(os.path.join(out, "05-extc-back.png"))
print("done")
