"""
Build a realistic, cloth-simulated jersey GLB from the flat ExTc jersey model.

The source model (extc.glb) is a puffed "pillow": a front and a back sheet whose x/y outline is a jersey sewing
pattern and whose UVs map the artwork front-on. This script treats those two sheets as real pattern pieces:

  1. lays them flat (rest shape = the 2D pattern, so the artwork is never distorted),
  2. wraps them around an invisible mannequin (torso, neck, arms angled down),
  3. sews them together along shoulders, sides and sleeves (hem, cuffs and neckline stay open),
  4. drapes them with a position-based cloth simulation (gravity, stretch, soft bending, body collision, friction),
  5. adds fabric thickness at the hem and cuffs, a ribbed collar, and bakes fold/seam shading into vertex colours,
  6. writes Jersey_Front / Jersey_Back / Collar meshes with the ORIGINAL UVs and textures, so the site's per-branch
     artwork pipeline keeps working unchanged.

Usage:  python tools/build_jersey.py <source extc.glb> <output jersey.glb> [--frames 420]
Needs numpy only.
"""
import sys, json, struct, time
import numpy as np
from collections import Counter, defaultdict

# ───────────────────────── GLB IO ─────────────────────────
def read_glb(path):
    b = open(path, 'rb').read()
    jl, _ = struct.unpack('<II', b[12:20]); j = json.loads(b[20:20 + jl])
    bo = 20 + jl; bl, _ = struct.unpack('<II', b[bo:bo + 8]); B = b[bo + 8:bo + 8 + bl]
    CT = {5126: np.float32, 5125: np.uint32, 5123: np.uint16, 5121: np.uint8}
    NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}
    def acc(i):
        a = j['accessors'][i]; bv = j['bufferViews'][a['bufferView']]
        off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); n = NC[a['type']]
        arr = np.frombuffer(B, dtype=CT[a['componentType']], count=a['count'] * n, offset=off)
        return arr.reshape(a['count'], n) if n > 1 else arr
    meshes = {}
    for m in j['meshes']:
        p = m['primitives'][0]; at = p['attributes']
        meshes[m['name']] = dict(pos=acc(at['POSITION']).astype(np.float64), uv=acc(at['TEXCOORD_0']).astype(np.float64),
                                 idx=acc(p['indices']).astype(np.int64).reshape(-1, 3), material=p.get('material'))
    images = []
    for im in j['images']:
        bv = j['bufferViews'][im['bufferView']]
        images.append((B[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']], im.get('mimeType', 'image/jpeg')))
    return meshes, images, j.get('materials', [])

def write_glb(path, meshes, images, materials):
    """meshes: list of dict(name, pos, nrm, uv, col, idx, material)"""
    blob = bytearray(); views = []; accs = []
    def add_view(data, target=None):
        while len(blob) % 4: blob.append(0)
        views.append({'buffer': 0, 'byteOffset': len(blob), 'byteLength': len(data), **({'target': target} if target else {})})
        blob.extend(data); return len(views) - 1
    def add_acc(arr, ctype, typ, target, minmax=False):
        v = add_view(arr.tobytes(), target)
        a = {'bufferView': v, 'componentType': ctype, 'count': int(arr.shape[0]), 'type': typ}
        if minmax: a['min'] = arr.min(0).tolist(); a['max'] = arr.max(0).tolist()
        accs.append(a); return len(accs) - 1
    gm, nodes = [], []
    for m in meshes:
        attrs = {'POSITION': add_acc(m['pos'].astype(np.float32), 5126, 'VEC3', 34962, True),
                 'NORMAL': add_acc(m['nrm'].astype(np.float32), 5126, 'VEC3', 34962),
                 'TEXCOORD_0': add_acc(m['uv'].astype(np.float32), 5126, 'VEC2', 34962),
                 'COLOR_0': add_acc(m['col'].astype(np.float32), 5126, 'VEC3', 34962)}
        idx = m['idx'].reshape(-1)
        ia = add_acc(idx.astype(np.uint16 if idx.max() < 65535 else np.uint32), 5123 if idx.max() < 65535 else 5125, 'SCALAR', 34963)
        gm.append({'name': m['name'], 'primitives': [{'attributes': attrs, 'indices': ia, 'material': m['material']}]})
        nodes.append({'name': m['name'], 'mesh': len(gm) - 1})
    imgs = []
    for data, mime in images: imgs.append({'bufferView': add_view(data), 'mimeType': mime})
    while len(blob) % 4: blob.append(0)
    gl = {'asset': {'version': '2.0', 'generator': 'RallyKit build_jersey.py (cloth-draped)'}, 'scene': 0,
          'scenes': [{'nodes': list(range(len(nodes)))}], 'nodes': nodes, 'meshes': gm, 'materials': materials,
          'textures': [{'source': i} for i in range(len(imgs))], 'images': imgs,
          'buffers': [{'byteLength': len(blob)}], 'bufferViews': views, 'accessors': accs}
    js = json.dumps(gl, separators=(',', ':')).encode(); js += b' ' * (-len(js) % 4)
    out = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(blob))
    out += struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(blob), 0x004E4942) + bytes(blob)
    open(path, 'wb').write(out)
    return len(out)

# ───────────────────────── mesh helpers ─────────────────────────
def boundary_edges(idx):
    e = np.sort(np.concatenate([idx[:, [0, 1]], idx[:, [1, 2]], idx[:, [2, 0]]]), 1)
    c = Counter(map(tuple, e)); return [k for k, v in c.items() if v == 1]

def loops(edges):
    adj = defaultdict(list)
    for a, b in edges: adj[a].append(b); adj[b].append(a)
    seen, out = set(), []
    for s in adj:
        if s in seen: continue
        loop, prev, cur = [s], None, s; seen.add(s)
        while True:
            nx = [n for n in adj[cur] if n != prev and n not in seen]
            if not nx: break
            prev, cur = cur, nx[0]; loop.append(cur); seen.add(cur)
        out.append(loop)
    return out

def vertex_normals(pos, idx):
    n = np.zeros_like(pos)
    fn = np.cross(pos[idx[:, 1]] - pos[idx[:, 0]], pos[idx[:, 2]] - pos[idx[:, 0]])
    for k in range(3): np.add.at(n, idx[:, k], fn)
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)

def neighbours(idx, n):
    e = np.concatenate([idx[:, [0, 1]], idx[:, [1, 2]], idx[:, [2, 0]]]); e = np.unique(np.sort(e, 1), axis=0)
    return e

def laplacian(vals, e, n, w=None):
    s = np.zeros_like(vals); c = np.zeros(n)
    np.add.at(s, e[:, 0], vals[e[:, 1]]); np.add.at(s, e[:, 1], vals[e[:, 0]])
    np.add.at(c, e[:, 0], 1); np.add.at(c, e[:, 1], 1)
    return s / np.maximum(c, 1)[:, None] if vals.ndim > 1 else s / np.maximum(c, 1)

def color_groups(pairs, n):
    """greedy colouring so no two constraints in a group share a vertex (lets each group be solved in parallel)."""
    used = [set() for _ in range(n)]; col = np.empty(len(pairs), np.int64)
    for k, (a, b) in enumerate(pairs):
        c = 0
        while c in used[a] or c in used[b]: c += 1
        col[k] = c; used[a].add(c); used[b].add(c)
    return [np.nonzero(col == c)[0] for c in range(col.max() + 1)]

# ───────────────────────── mannequin (signed distance) ─────────────────────────
NECK_Y, NECK_R, SHOULDER_SLOPE = 0.318, 0.064, 0.36
# Arms start along the pattern's sleeve axis (~20° below horizontal) so the sleeves can be sewn around them, then
# are lowered to a relaxed ghost-mannequin pose once the seams have closed (like dressing a real mannequin).
ARM_J, ARM_LEN, ARM_R = np.array([0.160, 0.250, 0.0]), 0.30, 0.050
SLEEVE_DROP = np.radians(25)          # sleeves rotated down in the pattern itself (no squashed shoulders)
ARM_START = ARM_END = np.radians(20) + SLEEVE_DROP
ARM = {'angle': ARM_START}
def torso_a(y): return np.interp(y, [-0.50, -0.15, 0.05, 0.16, 0.22, 0.30], [0.162, 0.157, 0.160, 0.168, 0.178, 0.178])   # athletic, straight cut
def torso_b(y): return np.interp(y, [-0.50, -0.15, 0.05, 0.14, 0.22, 0.30], [0.116, 0.114, 0.122, 0.128, 0.122, 0.092])   # full upper chest
def shoulder_top(x): return NECK_Y - SHOULDER_SLOPE * np.maximum(np.abs(x) - NECK_R, 0) ** 1.15 * 1.6

def smin(a, b, k):                                            # smooth union (rounded blends, no creases)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1); return b + (a - b) * h - k * h * (1 - h)
def smax(a, b, k): return -smin(-a, -b, k)

def body_sdf(P):
    """Smooth ghost mannequin: elliptical torso with rounded shoulders, blended neck and arms (the fitted shirt's shape)."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    a, b = torso_a(y), torso_b(y); zc = z + 0.005
    r = np.sqrt((x / a) ** 2 + (zc / b) ** 2)
    gr = np.sqrt((x / (a * a)) ** 2 + (zc / (b * b)) ** 2) / np.maximum(r, 1e-9)
    ell = (r - 1) / np.maximum(gr, 1e-9)                       # first-order true distance to the ellipse
    torso = smax(ell, y - shoulder_top(x), 0.06)               # rounded shoulder caps
    torso = np.maximum(torso, -0.52 - y)
    neck = np.maximum(np.sqrt(x ** 2 + (z + 0.012) ** 2) - NECK_R, y - 0.40)
    d = smin(torso, neck, 0.03)
    for s in (-1, 1):
        J = ARM_J * [s, 1, 1]; u = np.array([s * np.cos(ARM['angle']), -np.sin(ARM['angle']), 0])
        t = np.clip((P - J) @ u, 0, ARM_LEN)
        d = smin(d, np.linalg.norm(P - (J + t[:, None] * u), axis=1) - ARM_R, 0.045)   # smooth armhole blend
    return d

def sdf_grad(P, e=1e-3):
    g = np.empty_like(P)
    for k in range(3):
        dP = np.zeros(3); dP[k] = e
        g[:, k] = body_sdf(P + dP) - body_sdf(P - dP)
    return g / np.maximum(np.linalg.norm(g, axis=1, keepdims=True), 1e-9)

# ───────────────────────── build ─────────────────────────
def main():
    src, dst = sys.argv[1], sys.argv[2]
    frames = int(sys.argv[sys.argv.index('--frames') + 1]) if '--frames' in sys.argv else 420
    M, images, materials = read_glb(src)
    F, Bk, C = M['Jersey_Front'], M['Jersey_Back'], M.get('Collar')
    nF, nB = len(F['pos']), len(Bk['pos']); n = nF + nB
    S = 0.93                                                   # source units → metres: fitted on the mannequin (clean, no slack)
    pat2 = np.concatenate([F['pos'][:, :2], Bk['pos'][:, :2]])  # pattern outline, source units
    # Rotate each sleeve of the pattern down about its shoulder point (blended across the armhole), so the rest
    # shape already has dropped sleeves like a real set-in-sleeve tee; the artwork (UVs) rotates with the fabric.
    pw = pat2.copy()
    for sgn in (-1, 1):
        piv = np.array([0.261 * sgn, 0.350]); m = np.sign(pw[:, 0]) == sgn
        w = np.clip((np.abs(pat2[:, 0]) - 0.235) / 0.07, 0, 1); w = w * w * (3 - 2 * w)
        ang = -sgn * SLEEVE_DROP * w; c, s_ = np.cos(ang), np.sin(ang); r = pat2 - piv
        rot = np.stack([r[:, 0] * c - r[:, 1] * s_, r[:, 0] * s_ + r[:, 1] * c], 1) + piv
        pw[m] = rot[m]
    pat = pw * S
    uv = np.concatenate([F['uv'], Bk['uv']])
    tris = np.concatenate([F['idx'], Bk['idx'] + nF])
    side = np.r_[np.ones(nF), -np.ones(nB)]

    # ── seams: front/back boundary points that coincide in the pattern, except hem / cuffs / neckline
    bF = boundary_edges(F['idx']); bB = [(a + nF, b + nF) for a, b in boundary_edges(Bk['idx'])]
    vF = np.unique(np.array(bF)); vB = np.unique(np.array(bB))
    def is_open(i):
        x, y = pat2[i]
        if y < -0.375: return True                              # hem
        P1 = np.array([0.422 * np.sign(x), 0.275]); P2 = np.array([0.347 * np.sign(x), 0.113])
        d = P2 - P1; d /= np.linalg.norm(d); w = pat2[i] - P1
        if abs(x) > 0.34 and abs(w[0] * d[1] - w[1] * d[0]) < 0.004: return True   # cuff
        return False
    def poly_match(src_v, dst_e):
        dst_e = np.array(dst_e); A = pat2[dst_e[:, 0]]; AB = pat2[dst_e[:, 1]] - A; ab2 = np.maximum((AB ** 2).sum(1), 1e-12)
        out = []
        for i in src_v:
            if is_open(i): continue
            t = np.clip(((pat2[i] - A) * AB).sum(1) / ab2, 0, 1); d = np.linalg.norm(pat2[i] - (A + t[:, None] * AB), axis=1)
            k = d.argmin()
            if d[k] < 1e-3: out.append((i, dst_e[k, 0], dst_e[k, 1], t[k]))
        return out
    sc = poly_match(vF, bB) + poly_match(vB, bF)                  # (vertex, edge a, edge b, t) both directions
    sv_, sa, sb, st = (np.array([c[k] for c in sc]) for k in range(4))
    seam_set = set(sv_.tolist())
    # vertex-to-vertex pairs (for joining open-edge loops at seam corners)
    sF = np.array([v_ for v_ in vF if v_ in seam_set]); sB = np.array([v_ for v_ in vB if v_ in seam_set])
    Dc = np.linalg.norm(pat2[sF][:, None] - pat2[sB][None], axis=2)
    seam = np.array([(sF[i], sB[j]) for i, j in enumerate(Dc.argmin(1)) if Dc[i, j] < 1.5e-3])
    print(f'panels: front {nF} back {nB} verts · seam constraints {len(sc)} · coincident pairs {len(seam)}')
    cnt = np.zeros(n); np.add.at(cnt, sv_, 1); np.add.at(cnt, sa, 1 - st); np.add.at(cnt, sb, st)
    cnt = np.maximum(cnt, 1)[:, None]
    def sew(p, k):                                                # pull each seam vertex onto the matching edge point
        q = p[sa] * (1 - st)[:, None] + p[sb] * st[:, None]; C = p[sv_] - q
        lam = (C / (1 + (1 - st) ** 2 + st ** 2)[:, None]) * k
        acc = np.zeros_like(p)                                    # Jacobi-averaged: seams are matched from both panels
        np.add.at(acc, sv_, -lam); np.add.at(acc, sa, lam * (1 - st)[:, None]); np.add.at(acc, sb, lam * st[:, None])
        p += acc / cnt

    # ── initial wrap around the mannequin
    X, Y = pat[:, 0], pat[:, 1] - 0.012
    a, b = torso_a(Y), torso_b(Y)
    tz = b * np.sqrt(np.clip(1 - (X / (a + .01)) ** 2, 0, 1))
    off = np.interp(np.abs(X) - a, [-0.03, 0.03], [0.0, 1.0])
    Z = side * (tz * (1 - off) + 0.03 + 0.05 * off)
    x = np.stack([X, Y, Z], 1)

    # ── constraints (rest shape = flat pattern)
    E = neighbours(tris, n); restE = np.linalg.norm(pat[E[:, 0]] - pat[E[:, 1]], axis=1)
    et = defaultdict(list)
    for t, tri in enumerate(tris):
        for k in range(3): et[tuple(sorted((tri[k], tri[(k + 1) % 3])))].append(tri[(k + 2) % 3])
    bend = np.array([v for v in et.values() if len(v) == 2]); restB = np.linalg.norm(pat[bend[:, 0]] - pat[bend[:, 1]], axis=1)
    gE, gB = color_groups(E, n), color_groups(bend, n)
    print(f'constraints: stretch {len(E)} ({len(gE)} groups) · bend {len(bend)} ({len(gB)} groups)')

    def project(p, pairs, rest, groups, k):
        for g in groups:
            i, jj = pairs[g, 0], pairs[g, 1]
            d = p[jj] - p[i]; L = np.linalg.norm(d, axis=1)
            c = ((L - rest[g]) / np.maximum(L, 1e-9) * 0.5 * k)[:, None] * d
            p[i] += c; p[jj] -= c

    # ── simulate
    # "small steps" PBD: many substeps with one solver pass each holds fabric length far better than many
    # iterations per frame (a 0.7 m hanging mesh otherwise visibly stretches under gravity).
    dt, sub, g = 1 / 60, 16, np.array([0, 0.0, 0])            # no gravity: a fitted shirt is sewn on, never left to sag
    h = dt / sub
    v = np.zeros_like(x); skin = 0.0045; t0 = time.time()
    for f in range(frames):
        ks = min(1.0, (f + 1) / 150)                           # seams close gradually
        ARM['angle'] = ARM_START + (ARM_END - ARM_START) * float(np.clip((f - 170) / 110, 0, 1)) ** 2 * (3 - 2 * float(np.clip((f - 170) / 110, 0, 1)))
        damp = (0.985 if f < frames - 60 else 0.85) ** (1 / sub)
        for s in range(sub):
            v = v * damp + g * h
            sp = np.linalg.norm(v, axis=1, keepdims=True); v *= np.minimum(1, 1.5 / np.maximum(sp, 1e-9))
            p = x + v * h
            project(p, E, restE, gE, 1.0)
            project(p, bend, restB, gB, 0.32)          # sports polyester: holds its shape
            sew(p, ks)
            sd = body_sdf(p); hit = sd < skin
            nv = None
            if hit.any():
                gn = sdf_grad(p[hit]); p[hit] += gn * (skin - sd[hit])[:, None]
            nv = (p - x) / h
            if hit.any():                                       # friction: fabric rests on the body instead of sliding off
                vn = (nv[hit] * gn).sum(1, keepdims=True) * gn
                nv[hit] = np.maximum(vn, 0) * 0 + (nv[hit] - vn) * 0.6
            v, x = nv, p
        v = 0.6 * v + 0.4 * laplacian(v, E, n)                 # velocity smoothing: kills solver jitter, keeps drape
        if f % 60 == 0 or f == frames - 1:
            spd = np.linalg.norm(v, axis=1); hot = spd > np.percentile(spd, 99)
            if '--debug' in sys.argv: print('     hot verts: pattern', pat2[hot].mean(0).round(3), 'spread', pat2[hot].std(0).round(3), 'in-body', (body_sdf(x[hot]) < skin).mean().round(2), 'seam', np.isin(np.nonzero(hot)[0], sv_).mean().round(2), 'front', (np.nonzero(hot)[0] < nF).mean().round(2))
            bb = x.max(0) - x.min(0)
            print(f'  frame {f:4d}  p99 speed {np.percentile(np.linalg.norm(v, axis=1), 99):.3f} m/s  bbox {bb.round(3)}  seam gap {np.linalg.norm(x[sv_] - (x[sa] * (1 - st)[:, None] + x[sb] * st[:, None]), axis=1).max():.3f}  ({time.time() - t0:.0f}s)')

    # ── fit phase: gravity off, fabric pulled snugly onto the mannequin (fitted, no sag, no folds) while stretch
    # constraints keep its true size, so the artwork stays undistorted.
    OFF, fit = 0.005, 140
    for f in range(fit):
        kw = 0.6 * min(1.0, (f + 1) / 60)
        for s in range(8):
            project(x, E, restE, gE, 1.0)
            project(x, bend, restB, gB, 0.08)
            sew(x, 1.0)
            d = body_sdf(x) - OFF; near = d < 0.06
            x[near] -= sdf_grad(x[near]) * (d[near] * kw)[:, None]
        if f % 35 == 0 or f == fit - 1:
            dd = body_sdf(x) - OFF
            print(f'  fit {f:4d}  |offset error| p95 {np.percentile(np.abs(dd), 95) * 1000:.1f} mm  stretch err p95 {np.percentile(np.abs(np.linalg.norm(x[E[:, 0]] - x[E[:, 1]], axis=1) / restE - 1), 95) * 100:.1f}%')
    # Taubin smoothing (no shrinkage): an ironed, product-shot surface
    for _ in range(4):
        x += 0.55 * (laplacian(x, E, n) - x); x -= 0.58 * (laplacian(x, E, n) - x)
    for _ in range(40): sew(x, 1.0)
    nrm = vertex_normals(x, tris)
    nt = nrm[sv_] + nrm[sa] * (1 - st)[:, None] + nrm[sb] * st[:, None]
    nrm[sv_] = nt / np.linalg.norm(nt, axis=1, keepdims=True)

    # ── baked shading: fold cavities + seam lines
    edge_len = restE.mean()
    cav = ((laplacian(x, E, n) - x) * nrm).sum(1) / edge_len         # >0 = valley
    for _ in range(3): cav = 0.5 * cav + 0.5 * laplacian(cav, E, n)
    ao = 1 - np.clip(cav / np.percentile(np.abs(cav), 97), 0, 1) * 0.12      # faint contour shading only
    sv = np.array(sorted(seam_set))
    dmin = np.full(n, 1e9)
    for k in range(0, n, 4000):
        dmin[k:k + 4000] = np.sqrt(((pat[k:k + 4000, None] - pat[None, sv]) ** 2).sum(2)).min(1)
    ao *= 1 - 0.16 * np.clip(1 - dmin / 0.007, 0, 1)                # stitched seam line
    col = np.repeat(ao[:, None], 3, 1)

    # ── open edges (hem, cuffs, neckline) as loops over the sewn garment
    rep = np.arange(n); rep[seam[:, 1]] = seam[:, 0]
    open_e = [(a_, b_) for a_, b_ in bF + bB if not (a_ in seam_set and b_ in seam_set)]
    L_ = loops([(rep[a_], rep[b_]) for a_, b_ in open_e])
    L_ = [l for l in L_ if len(l) > 8]
    print('open loops:', [len(l) for l in L_])
    adjset = set(map(tuple, np.sort(np.array([(rep[a_], rep[b_]) for a_, b_ in open_e]), 1)))
    ext_pos, ext_nrm, ext_uv, ext_col, ext_idx = [], [], [], [], []
    def strip(rings, vs, closed=True):
        base = sum(len(p_) for p_ in ext_pos); m_ = len(rings[0])
        for r_, vv in zip(rings, vs): ext_pos.append(r_); ext_uv.append(np.stack([np.linspace(0, 4, m_), np.full(m_, vv)], 1))
        for r in range(len(rings) - 1):
            for k in range(m_ if closed else m_ - 1):
                a0 = base + r * m_ + k; a1 = base + r * m_ + (k + 1) % m_; b0 = a0 + m_; b1 = a1 + m_
                ext_idx.append([a0, b0, a1]); ext_idx.append([a1, b0, b1])
    nb = defaultdict(list)
    for a_, b_ in E: nb[a_].append(b_); nb[b_].append(a_)
    for loop in L_:
        closed = tuple(sorted((loop[0], loop[-1]))) in adjset
        P = x[loop].copy(); N_ = nrm[loop]
        for _ in range(10):                                            # smooth the edge line so rims are clean
            Q = (np.roll(P, 1, 0) + 2 * P + np.roll(P, -1, 0)) / 4
            if not closed: Q[0], Q[-1] = P[0], P[-1]
            P = Q
        T = np.roll(P, -1, 0) - np.roll(P, 1, 0); T /= np.linalg.norm(T, axis=1, keepdims=True)
        W = np.cross(N_, T); W /= np.linalg.norm(W, axis=1, keepdims=True)
        inward = np.array([x[nb[i]].mean(0) - x[i] for i in loop])
        W *= np.sign((W * inward).sum(1))[:, None]                     # W points into the fabric
        for _ in range(3): W = (np.roll(W, 1, 0) + W + np.roll(W, -1, 0)) / 3
        W /= np.linalg.norm(W, axis=1, keepdims=True)
        neckish = P[:, 1].mean() > 0.18
        th = 0.0032
        if neckish:                                                    # ribbed collar standing just past the neckline
            r0 = P - N_ * 0.0005; r1 = P - W * 0.010 + N_ * 0.0012; r2 = r1 - N_ * th; r3 = P - N_ * th + W * 0.004   # slim flat rib
            strip([r0, r1, r2, r3], [0.55, 0.035, 0.035, 0.55], closed)
        else:                                                          # folded hem / cuff: thickness + inner turn-up
            if P[:, 1].mean() > -0.2:                                  # cuff: visible rib band, like the reference
                r0 = P - N_ * 0.0005; r1 = P - W * 0.016 + N_ * 0.0015; r2 = r1 - N_ * th; r3 = P - N_ * th + W * 0.012
                strip([r0, r1, r2, r3], [0.55, 0.035, 0.035, 0.55], closed)
            else:                                                      # hem: fabric thickness + turned-up inner hem
                r0 = P; r1 = P - N_ * th; r2 = r1 + W * 0.02
                strip([r0, r1, r2], [0.6, 0.6, 0.6], closed)
    cp = np.concatenate(ext_pos); ci = np.array(ext_idx); cu = np.concatenate(ext_uv)
    cn = vertex_normals(cp, ci); cc = np.full((len(cp), 3), 0.9)

    # ── centre (feet of the garment don't matter; the site normalises), write
    out = [dict(name='Jersey_Front', pos=x[:nF], nrm=nrm[:nF], uv=uv[:nF], col=col[:nF], idx=F['idx'], material=F['material']),
           dict(name='Jersey_Back', pos=x[nF:], nrm=nrm[nF:], uv=uv[nF:], col=col[nF:], idx=Bk['idx'], material=Bk['material']),
           dict(name='Collar', pos=cp, nrm=cn, uv=cu, col=cc, idx=ci, material=C['material'] if C else 2)]
    size = write_glb(dst, out, images, materials)
    bb = x.max(0) - x.min(0)
    print(f'wrote {dst}: {size / 1e6:.2f} MB · garment {bb[0]:.2f} x {bb[1]:.2f} x {bb[2]:.2f} m · {len(tris) + len(ci)} tris')

if __name__ == '__main__':
    main()
