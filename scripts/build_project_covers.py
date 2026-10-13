"""
Generate SVG cover art for projects that have no screenshot or demo video.

Usage:
    python3 scripts/build_project_covers.py      # writes public/projects/<slug>.svg

Every cover shares one frame (Deep Ocean navy, dot grid, category colour,
a `~/projects/<slug>` label) and draws a small diagram of what the project
actually does, so the grid reads as one set rather than stock art.
"""
import math, os, random

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "projects")
W, H = 960, 540
CAT = {"ai": "#38BDF8", "software": "#A78BFA", "data": "#34D399"}
INK, DIM, LINE, CARD = "#E2E8F0", "#94A3B8", "#334155", "#111C2E"
MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"


def frame(slug, cat, tag, body):
    c = CAT[cat]
    dots = "".join(f'<circle cx="{x}" cy="{y}" r="1.1" fill="#1E293B"/>'
                   for x in range(24, W, 32) for y in range(24, H, 32))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1220"/><stop offset="1" stop-color="#0F1B33"/></linearGradient>
  <radialGradient id="glow" cx="0.75" cy="0.2" r="0.7"><stop offset="0" stop-color="{c}" stop-opacity="0.18"/><stop offset="1" stop-color="{c}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>{dots}<rect width="{W}" height="{H}" fill="url(#glow)"/>
<g font-family="{MONO}">{body}</g>
<g font-family="{MONO}" font-size="15">
  <text x="32" y="{H-28}" fill="{DIM}">~/projects/<tspan fill="{c}">{slug}</tspan></text>
  <rect x="{W-32-len(tag)*9.2-20}" y="22" width="{len(tag)*9.2+20}" height="26" rx="5" fill="{c}" fill-opacity="0.14" stroke="{c}" stroke-opacity="0.5"/>
  <text x="{W-42}" y="40" fill="{c}" text-anchor="end">{tag}</text>
</g></svg>'''


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def box(x, y, w, h, stroke=LINE, fill=CARD, rx=8, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" {extra}/>'


def txt(x, y, s, fill=INK, size=15, anchor="start", weight="normal"):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}">{esc(s)}</text>'


# ---------------------------------------------------------------- covers ---
def cafepulse():
    c = CAT["software"]
    rows = [("Q1", "Sales vs target", "+7.1%", "#34D399"), ("Q2", "Roster, 1 call-out", "warn", "#FBBF24"),
            ("Q3", "Oat milk low", "reorder", "#FBBF24"), ("Q4", "Grinder #2", "ok", "#34D399"),
            ("Q6", "Peak 8-9 AM", "$1.2k", "#34D399"), ("Q10", "Void rate 3 days up", "alert", "#F87171")]
    b = box(80, 70, 430, 390, stroke=c, extra='stroke-opacity="0.6"')
    b += txt(104, 108, "06:00  Morning brief", c, 18, weight="bold") + txt(104, 132, "Surry Hills · 10 questions", DIM, 13)
    for i, (q, label, v, col) in enumerate(rows):
        y = 168 + i * 44
        b += f'<line x1="104" y1="{y-26}" x2="486" y2="{y-26}" stroke="{LINE}"/>'
        b += txt(104, y, q, DIM, 14) + txt(152, y, label, INK, 15)
        b += f'<circle cx="420" cy="{y-5}" r="5" fill="{col}"/>' + txt(486, y, v, col, 13, "end")
    # revenue forecast chart
    pts = [(560 + i * 34, 330 - 60 * math.sin(i / 2.2) - i * 6) for i in range(11)]
    band_top = " ".join(f"{x},{y-22-i*2}" for i, (x, y) in enumerate(pts[6:]))
    band_bot = " ".join(f"{x},{y+22+i*2}" for i, (x, y) in reversed(list(enumerate(pts[6:]))))
    b += box(540, 150, 380, 260)
    b += txt(560, 182, "Revenue · Prophet forecast", DIM, 13)
    b += f'<polygon points="{band_top} {band_bot}" fill="{c}" fill-opacity="0.15"/>'
    b += f'<polyline points="{" ".join(f"{x},{y}" for x, y in pts[:7])}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
    b += f'<polyline points="{" ".join(f"{x},{y}" for x, y in pts[6:])}" fill="none" stroke="{c}" stroke-width="2.5" stroke-dasharray="6 5"/>'
    return frame("cafepulse", "software", "LangGraph · Groq · Prophet", b)


def curricullm():
    c = CAT["software"]
    b = box(80, 80, 330, 360) + txt(104, 116, "Progress report · Term 3", c, 16, weight="bold")
    for i, w in enumerate([270, 240, 280, 190, 260, 220, 150]):
        b += f'<rect x="104" y="{140+i*30}" width="{w}" height="10" rx="5" fill="{LINE}"/>'
    b += f'<rect x="104" y="370" width="120" height="44" rx="6" fill="{c}" fill-opacity="0.18"/>' + txt(116, 398, "Maths  B+", c, 15)
    bub = [(470, 120, "How is Minh doing in reading?", "#1E293B", INK, "start"),
           (560, 200, "Reading is up one level since May.", c, "#0B1220", "start"),
           (560, 270, "Đọc hiểu tăng một bậc từ tháng 5.", c, "#0B1220", "start")]
    for x, y, s, f, tcol, _ in bub:
        w = len(s) * 9 + 32
        b += f'<rect x="{x}" y="{y}" width="{w}" height="46" rx="14" fill="{f}" fill-opacity="{1 if f != c else 0.9}"/>' + txt(x + 16, y + 29, s, tcol, 15)
    b += f'<rect x="560" y="340" width="150" height="30" rx="15" fill="none" stroke="{c}"/>' + txt(635, 360, "EN ⇄ VI live", c, 13, "middle")
    return frame("curricullm", "software", "EduX Hackathon 2026", b)


def ecommerce():
    c = CAT["software"]
    # tables and columns taken from Supermarket-main/data.sql
    t = {"Users": (90, 90, ["id PK", "username", "email", "role"]), "Orders": (380, 70, ["id PK", "customer_id FK", "total_cost", "status"]),
         "OrderDetails": (380, 300, ["order_id FK", "product_id FK", "quantity"]), "Products": (670, 210, ["id PK", "name", "price", "remaining"]),
         "Payments": (90, 320, ["id PK", "order_id FK", "payment_mode"])}
    b = ""
    links = [("Users", "Orders"), ("Orders", "OrderDetails"), ("OrderDetails", "Products"), ("Orders", "Payments")]
    def center(n):
        x, y, cols = t[n]; return x + 100, y + 20 + len(cols) * 13
    for a, z in links:
        (x1, y1), (x2, y2) = center(a), center(z)
        b += f'<path d="M{x1},{y1} C{(x1+x2)/2},{y1} {(x1+x2)/2},{y2} {x2},{y2}" fill="none" stroke="{c}" stroke-opacity="0.55" stroke-width="2"/>'
    for n, (x, y, cols) in t.items():
        h = 44 + len(cols) * 26
        b += box(x, y, 200, h) + f'<rect x="{x}" y="{y}" width="200" height="34" rx="8" fill="{c}" fill-opacity="0.2"/>' + txt(x + 14, y + 23, n, c, 15, weight="bold")
        for i, col in enumerate(cols):
            b += txt(x + 14, y + 60 + i * 26, col, INK if "PK" in col or "FK" in col else DIM, 13)
    b += txt(900, 480, "PostgreSQL · 3NF · JWT", DIM, 13, "end")
    return frame("e-commerce", "software", "React · Express · PostgreSQL", b)


def ml_scratch():
    c = CAT["ai"]; cx, cy = 340, 280
    b = ""
    for i in range(1, 8):
        b += f'<ellipse cx="{cx}" cy="{cy}" rx="{i*38}" ry="{i*22}" transform="rotate(-25 {cx} {cy})" fill="none" stroke="{c}" stroke-opacity="{0.12+i*0.06:.2f}"/>'
    path, x, y = [], 600.0, 120.0
    for _ in range(14):
        path.append((x, y)); x += (cx - x) * 0.32 + 6; y += (cy - y) * 0.34 - 4
    b += f'<polyline points="{" ".join(f"{a:.0f},{b_:.0f}" for a, b_ in path)}" fill="none" stroke="#FBBF24" stroke-width="2"/>'
    b += "".join(f'<circle cx="{a:.0f}" cy="{b_:.0f}" r="4.5" fill="#FBBF24"/>' for a, b_ in path)
    b += box(640, 300, 270, 140) + txt(660, 334, "θ ← θ − η ∇J(θ)", INK, 18)
    b += txt(660, 368, "L2 penalty  λ‖θ‖²", DIM, 14) + txt(660, 396, "no sklearn, NumPy only", DIM, 14) + txt(660, 424, "bias ↔ variance", c, 14)
    return frame("ml-from-scratch", "ai", "NumPy · gradient descent", b)


def frontend():
    c = CAT["software"]; x0, y0, s = 120, 110, 100
    b = ""
    for i in (1, 2):
        b += f'<line x1="{x0+i*s}" y1="{y0}" x2="{x0+i*s}" y2="{y0+3*s}" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        b += f'<line x1="{x0}" y1="{y0+i*s}" x2="{x0+3*s}" y2="{y0+i*s}" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
    board = {(0, 0): "X", (1, 1): "O", (2, 0): "X", (0, 2): "O", (1, 0): "X"}
    for (r, col), v in board.items():
        cx, cy = x0 + col * s + s / 2, y0 + r * s + s / 2
        if v == "X":
            b += f'<path d="M{cx-26},{cy-26} L{cx+26},{cy+26} M{cx+26},{cy-26} L{cx-26},{cy+26}" stroke="{c}" stroke-width="7" stroke-linecap="round"/>'
        else:
            b += f'<circle cx="{cx}" cy="{cy}" r="28" fill="none" stroke="#38BDF8" stroke-width="7"/>'
    b += f'<line x1="{x0+s/2}" y1="{y0+s/2-10}" x2="{x0+s/2}" y2="{y0+2.5*s+10}" stroke="#FBBF24" stroke-width="5" stroke-opacity="0.8"/>'
    b += txt(x0, y0 + 3 * s + 40, "↶ undo · move history", DIM, 14)
    b += box(530, 110, 330, 120) + txt(554, 150, "♫  Now playing", c, 15) + f'<rect x="554" y="180" width="282" height="6" rx="3" fill="{LINE}"/><rect x="554" y="180" width="170" height="6" rx="3" fill="{c}"/>'
    b += box(530, 260, 330, 150) + txt(554, 300, "Sydney", INK, 16) + txt(554, 360, "22°", INK, 48, weight="bold") + txt(836, 360, "☁ ☀", "#FBBF24", 30, "end")
    return frame("frontend-projects", "software", "React · JS · HTML/CSS", b)


def telemetry():
    c = CAT["data"]; random.seed(7)
    x0, y0, w, h = 90, 90, 780, 320
    b = box(x0 - 20, y0 - 30, w + 40, h + 70)
    for i in range(5):
        b += f'<line x1="{x0}" y1="{y0+i*h/4}" x2="{x0+w}" y2="{y0+i*h/4}" stroke="{LINE}" stroke-dasharray="3 5"/>'
    for col, phase, amp in [(c, 0, 1), ("#38BDF8", 1.3, 0.7), ("#A78BFA", 2.1, 0.5)]:
        pts = [(x0 + i * w / 39, y0 + h * 0.85 - (i / 39) * h * 0.55 * amp - 18 * math.sin(i / 3 + phase)) for i in range(40)]
        b += f'<polyline points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in pts)}" fill="none" stroke="{col}" stroke-width="2.5"/>'
    for x, y in [(x0 + 0.62 * w, y0 + 0.18 * h), (x0 + 0.33 * w, y0 + 0.92 * h)]:
        b += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="9" fill="none" stroke="#F87171" stroke-width="2.5"/>' + txt(x + 14, y + 5, "outlier", "#F87171", 13)
    b += txt(x0, y0 - 6, "player metrics over match time", DIM, 13)
    return frame("game-telemetry", "data", "Pandas · Seaborn", b)


def ocr():
    c = CAT["data"]
    b = box(80, 90, 360, 330, fill="#1A2234")
    b += f'<g transform="rotate(-6 260 255)">'
    for i, w in enumerate([280, 250, 290, 200, 260, 230]):
        b += f'<rect x="{120}" y="{140+i*44}" width="{w}" height="12" rx="3" fill="{DIM}" fill-opacity="{0.35+0.1*(i%2)}"/>'
    b += "".join(f'<circle cx="{random.Random(i).randint(100,420)}" cy="{random.Random(i*7).randint(110,400)}" r="1.6" fill="{DIM}"/>' for i in range(60))
    b += "</g>"
    b += f'<path d="M470,255 L520,255" stroke="{c}" stroke-width="3"/><path d="M512,247 L524,255 L512,263" fill="none" stroke="{c}" stroke-width="3"/>'
    b += txt(497, 235, "deskew", DIM, 12, "middle") + txt(497, 285, "denoise", DIM, 12, "middle")
    b += box(550, 90, 340, 330)
    for i, (w, s) in enumerate([(270, "INVOICE NO 0418"), (240, "DATE 12/03/2025"), (280, "TOTAL  1,250,000"), (200, "VAT 10%")]):
        y = 140 + i * 66
        b += f'<rect x="574" y="{y}" width="{w}" height="30" rx="3" fill="none" stroke="{c}" stroke-width="2"/>' + txt(582, y + 21, s, INK, 15)
    return frame("ocr-preprocessing", "data", "OpenCV · PaddleOCR", b)


def housing():
    c = CAT["data"]; rnd = random.Random(3)
    x0, y0, w, h = 110, 80, 560, 360
    b = f'<line x1="{x0}" y1="{y0+h}" x2="{x0+w}" y2="{y0+h}" stroke="{DIM}"/><line x1="{x0}" y1="{y0}" x2="{x0}" y2="{y0+h}" stroke="{DIM}"/>'
    for _ in range(70):
        u = rnd.random(); x = x0 + 20 + u * (w - 40); yl = y0 + h - 30 - u * (h - 80); y = yl + rnd.gauss(0, 28)
        b += f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x:.0f}" y2="{yl:.0f}" stroke="{c}" stroke-opacity="0.25"/>'
        b += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="4" fill="{c}" fill-opacity="0.75"/>'
    b += f'<line x1="{x0+20}" y1="{y0+h-30}" x2="{x0+w-20}" y2="{y0+50}" stroke="#FBBF24" stroke-width="3"/>'
    b += txt(x0 + w / 2, y0 + h + 30, "living area (m²)", DIM, 13, "middle") + txt(x0 - 12, y0 - 12, "price", DIM, 13)
    b += box(700, 140, 200, 170) + txt(720, 176, "OLS summary", c, 15, weight="bold")
    for i, s in enumerate(["R², adjusted R²", "t-tests, p-values", "residual plots", "correlation matrix"]):
        b += txt(720, 210 + i * 26, s, DIM, 14)
    return frame("housing-price", "data", "Pandas · scikit-learn", b)


def dynawin():
    c = CAT["ai"]
    rad, red = "#38BDF8", "#F87171"; cx, cy = 300, 270
    nodes = [(cx - 150 + 60 * math.cos(a), cy + 120 * math.sin(a)) for a in [i * 2 * math.pi / 5 for i in range(5)]]
    nodes += [(cx + 150 + 60 * math.cos(a), cy + 120 * math.sin(a)) for a in [i * 2 * math.pi / 5 + 0.6 for i in range(5)]]
    b = ""
    edges = [(0, 6, 0.9), (1, 5, 0.6), (2, 7, 0.4), (3, 8, 0.8), (4, 9, 0.3), (0, 1, 0.3), (5, 6, 0.3), (2, 3, 0.3), (7, 8, 0.3), (1, 7, 0.5)]
    for a, z, wgt in edges:
        (x1, y1), (x2, y2) = nodes[a], nodes[z]
        b += f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="#FBBF24" stroke-opacity="{wgt:.2f}" stroke-width="{1+3*wgt:.1f}"/>'
    for i, (x, y) in enumerate(nodes):
        b += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="15" fill="{rad if i < 5 else red}" fill-opacity="0.85" stroke="#0B1220" stroke-width="3"/>'
    b += box(600, 130, 300, 260) + txt(620, 162, "P(win) per minute", DIM, 13)
    pts = [(620 + i * 13, 260 - 70 * math.tanh((i - 9) / 5) + 12 * math.sin(i)) for i in range(21)]
    b += f'<line x1="620" y1="260" x2="880" y2="260" stroke="{LINE}" stroke-dasharray="4 4"/>'
    b += f'<polyline points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in pts)}" fill="none" stroke="{c}" stroke-width="3"/>'
    b += txt(620, 370, "GAT + GRU", INK, 15)
    return frame("dynawin-gnn", "ai", "PyTorch Geometric", b)


def agent_market():
    c = CAT["software"]
    b = box(80, 70, 800, 380)
    msgs = [("buyer", "3 units at $34 each, free shipping?", 0), ("seller", "$37, I'll add free shipping.", 1),
            ("buyer", "$35 and I use coupon SAVE5.", 0), ("seller", "Deal: 3 × $35, free ship, SAVE5", 1)]
    for i, (who, s, side) in enumerate(msgs):
        y = 100 + i * 78; w = len(s) * 9 + 40; x = 110 if side == 0 else 850 - w
        col = "#38BDF8" if side == 0 else c
        b += f'<rect x="{x}" y="{y+14}" width="{w}" height="44" rx="14" fill="{col}" fill-opacity="0.16" stroke="{col}" stroke-opacity="0.6"/>'
        b += txt(x + 18, y + 42, s, INK, 15) + txt(x + (4 if side == 0 else w - 4), y + 8, f"{who}-agent", col, 12, "start" if side == 0 else "end")
    b += f'<rect x="330" y="410" width="300" height="34" rx="17" fill="#34D399" fill-opacity="0.16" stroke="#34D399"/>' + txt(480, 432, "✓ human confirms the order", "#34D399", 14, "middle")
    return frame("agent-market", "software", "WebMCP · Spring Boot", b)


COVERS = {"cafepulse": cafepulse, "curricullm": curricullm, "e-commerce": ecommerce, "ml-from-scratch": ml_scratch,
          "frontend-projects": frontend, "game-telemetry": telemetry, "ocr-preprocessing": ocr,
          "housing-price": housing, "dynawin-gnn": dynawin}
# agent_market() is kept for reference; the card now uses a frame from the demo video.

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for slug, fn in COVERS.items():
        with open(os.path.join(OUT, f"{slug}.svg"), "w", encoding="utf-8") as f:
            f.write(fn())
        print(f"wrote public/projects/{slug}.svg")
