# 청동 문짝 높이맵(SVG) → SVG 조명 필터로 렌더 → PNG
import sys
def leaf(W, H, cols, rows, mirror=False):
    m = 0.075*W            # 바깥 테
    g = 0.06*W             # 판넬 사이
    top, bot = 0.06*H, 0.06*H
    pw = (W - 2*m - (cols-1)*g)/cols
    ph = (H - top - bot - (rows-1)*g)/rows
    s = []
    # 높이(밝을수록 높음): 바탕 0.45, 테 0.75, 판넬 홈 0.18, 솟은 가운데 0.62, 몰딩 0.9
    s.append(f"<rect width='{W}' height='{H}' fill='rgb(115,115,115)'/>")
    s.append(f"<rect x='6' y='6' width='{W-12}' height='{H-12}' fill='none' stroke='rgb(190,190,190)' stroke-width='{m*0.55}'/>")
    kc = (cols-1) if not mirror else 0
    kr = rows//2
    for c in range(cols):
        for r in range(rows):
            x = m + c*(pw+g); y = top + r*(ph+g)
            knock = (c==kc and r==kr)
            # 몰딩 테두리(볼록)
            s.append(f"<rect x='{x-6}' y='{y-6}' width='{pw+12}' height='{ph+12}' rx='3' fill='rgb(225,225,225)'/>")
            # 홈(오목)
            s.append(f"<rect x='{x+6}' y='{y+6}' width='{pw-12}' height='{ph-12}' rx='2' fill='rgb(45,45,45)'/>")
            # 솟은 가운데 판(피라미드처럼 단계적으로)
            for k,v in enumerate([110,135,155,165]):
                inset = 0.16*min(pw,ph) + k*0.035*min(pw,ph)
                s.append(f"<rect x='{x+inset}' y='{y+inset}' width='{pw-2*inset}' height='{ph-2*inset}' rx='2' fill='rgb({v},{v},{v})'/>")
            mr = 0.17*min(pw,ph); cx_=x+pw/2; cy_=y+ph/2
            if knock:
                KX, KY, KR = cx_, cy_, 0.3*min(pw,ph)
                continue
            s.append(f"<circle cx='{cx_}' cy='{cy_}' r='{mr}' fill='rgb(95,95,95)'/>")
            s.append(f"<circle cx='{cx_}' cy='{cy_}' r='{mr*0.86}' fill='rgb(205,205,205)'/>")
            s.append(f"<circle cx='{cx_}' cy='{cy_}' r='{mr*0.7}' fill='rgb(150,150,150)'/>")
            s.append(f"<circle cx='{cx_}' cy='{cy_}' r='{mr*0.32}' fill='url(#boss)'/>")
    # 판넬 교차점 로제트(꽃 모양 장식)
    import math
    def rosette(cx, cy, R):
        out=[f"<circle cx='{cx}' cy='{cy}' r='{R*1.25}' fill='rgb(150,150,150)'/>"]
        for k in range(8):
            a=k*math.pi/4
            out.append(f"<circle cx='{cx+math.cos(a)*R*0.62:.1f}' cy='{cy+math.sin(a)*R*0.62:.1f}' r='{R*0.36:.1f}' fill='url(#stud)'/>")
        out.append(f"<circle cx='{cx}' cy='{cy}' r='{R*0.42}' fill='url(#stud)'/>")
        return out
    R = 0.03*W
    for c in range(cols+1):
        for r in range(rows+1):
            cx = m - g/2 + c*(pw+g) if 0<c<cols else (m*0.5 if c==0 else W-m*0.5)
            cy = top - g/2 + r*(ph+g) if 0<r<rows else (top*0.5 if r==0 else H-bot*0.5)
            s += rosette(cx, cy, R)
    # 사자 받침 + 링 문고리 (문틈 쪽, 가운데 높이)
    kx, ky = KX, KY - KR*0.25
    s.append(f"<circle cx='{kx}' cy='{ky-KR*0.55}' r='{KR*0.42}' fill='url(#boss)'/>")
    s.append(f"<circle cx='{kx}' cy='{ky+KR*0.35}' r='{KR*0.82}' fill='none' stroke='url(#ring)' stroke-width='{KR*0.2}'/>")
    s.append(f"<ellipse cx='{kx}' cy='{ky-KR*0.1}' rx='{KR*0.16}' ry='{KR*0.22}' fill='rgb(230,230,230)'/>")
    # 문틈 쪽 리벳 줄
    sx = W - m*0.5 if not mirror else m*0.5
    n = int(H/70)
    for i in range(n):
        cy = top*0.6 + i*(H-top*1.2)/(n-1)
        s.append(f"<circle cx='{sx}' cy='{cy}' r='{W*0.012+4}' fill='url(#stud)'/>")
    return "\n".join(s)

def svg(W,H,cols,rows,mirror,az):
    return f"""<svg xmlns='http://www.w3.org/2000/svg' width='{W}' height='{H}' viewBox='0 0 {W} {H}'>
<defs>
 <radialGradient id='boss'><stop offset='0' stop-color='#fff'/><stop offset='0.45' stop-color='#e8e8e8'/><stop offset='0.8' stop-color='#bbb'/><stop offset='1' stop-color='#888'/></radialGradient>
 <linearGradient id='ring' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff'/><stop offset='1' stop-color='#ddd'/></linearGradient>
 <radialGradient id='stud'><stop offset='0' stop-color='#fff'/><stop offset='0.7' stop-color='#ddd'/><stop offset='1' stop-color='#777'/></radialGradient>
 <filter id='bronze' x='0' y='0' width='1' height='1' color-interpolation-filters='sRGB'>
  <feColorMatrix in='SourceGraphic' type='luminanceToAlpha' result='h0'/>
  <feGaussianBlur in='h0' stdDeviation='{max(1.4,W/480):.1f}' result='h1'/>
  <feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='11' result='grain'/>
  <feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' seed='5' result='blot'/>
  <feTurbulence type='fractalNoise' baseFrequency='0.09' numOctaves='2' seed='21' result='pit'/>
  <feComposite in='h1' in2='grain' operator='arithmetic' k2='1' k3='0.016' result='hg'/>
  <feComposite in='hg' in2='pit' operator='arithmetic' k2='1' k3='0.03' result='h'/>
  <feDiffuseLighting in='h' surfaceScale='{W/90:.1f}' diffuseConstant='0.95' lighting-color='#ffffff' result='diff'><feDistantLight azimuth='{az}' elevation='42'/></feDiffuseLighting>
  <feSpecularLighting in='h' surfaceScale='{W/90:.1f}' specularConstant='1.5' specularExponent='60' lighting-color='#ffdca6' result='spec'><feDistantLight azimuth='{az}' elevation='28'/></feSpecularLighting>
  <feFlood flood-color='#4f361f' result='base'/>
  <feComposite in='base' in2='diff' operator='arithmetic' k1='1.25' result='lit'/>
  <!-- 녹 얼룩: 큰 무늬로 어둡고 탁하게 -->
  <feColorMatrix in='blot' type='matrix' values='0 0 0 0 0.05  0 0 0 0 0.07  0 0 0 0 0.055  0 0 0 1.2 -0.25' result='patina0'/>
  <feColorMatrix in='h0' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.05' result='lowmask'/>
  <feComposite in='patina0' in2='lowmask' operator='in' result='patina'/>
  <feComposite in='patina' in2='lit' operator='over' result='lit2'/>
  <!-- 파인 곳은 더 어둡게(주변광 가림) -->
  <feGaussianBlur in='h0' stdDeviation='{W/40:.1f}' result='hb'/>
  <feColorMatrix in='hb' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 0.9' result='ao'/>
  <feComposite in='ao' in2='lit2' operator='over' result='lit3'/>
  <feTurbulence type='fractalNoise' baseFrequency='0.004 0.007' numOctaves='3' seed='31' result='tone0'/>
  <feColorMatrix in='tone0' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.25' result='tone'/>
  <feComposite in='tone' in2='lit3' operator='over' result='lit4'/>
  <feColorMatrix in='h0' type='matrix' values='0 0 0 0 0.85  0 0 0 0 0.62  0 0 0 0 0.32  0 0 0 2.6 -2.05' result='wear'/>
  <feComposite in='wear' in2='grain' operator='arithmetic' k1='0' k2='0.55' k3='0' result='wear2'/>
  <feComposite in='wear2' in2='lit4' operator='over' result='lit5'/>
  <feComposite in='lit5' in2='spec' operator='arithmetic' k2='1' k3='0.9' result='out'/>
  <feComposite in='out' in2='SourceGraphic' operator='in'/>
 </filter>
</defs>
<g filter='url(#bronze)'>{leaf(W,H,cols,rows,mirror)}</g>
</svg>"""
import json
cfg=json.loads(sys.argv[1])
open(cfg['out'],'w').write(svg(cfg['W'],cfg['H'],cfg['cols'],cfg['rows'],cfg['mirror'],cfg['az']))
