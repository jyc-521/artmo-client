
import json, sys
cfg=json.loads(sys.argv[1]); S=cfg['S']; az=cfg['az']
FILTER = open('door.py').read().split("<filter id='bronze'")[1].split('</filter>')[0]
FILTER = FILTER.split('>',1)[1]
FILTER = FILTER.replace('{max(1.4,W/480):.1f}', str(S*0.022)).replace('{W/55:.1f}', str(S/10)).replace('{W/40:.1f}', str(S/18)).replace('{W/70:.1f}', str(S/60)).replace('{W/260:.1f}','1.2').replace('{SHDX}','0').replace('{az}', str(az))
FILTER = FILTER.replace("<feComposite in='out' in2='SourceGraphic' operator='in'/>","<feComposite in='out' in2='SourceAlpha' operator='in'/>")
R=S*0.25; cx=S/2
shapes=f'''
<circle cx='{cx}' cy='{S*0.2}' r='{S*0.11}' fill='url(#boss)'/>
<ellipse cx='{cx}' cy='{S*0.31}' rx='{S*0.04}' ry='{S*0.06}' fill='rgb(230,230,230)'/>
<circle cx='{cx}' cy='{S*0.6}' r='{R}' fill='none' stroke='#fff' stroke-width='{S*0.07}'/>
'''
svg=f'''<svg xmlns='http://www.w3.org/2000/svg' width='{S}' height='{S}' viewBox='0 0 {S} {S}'><defs>
<radialGradient id='boss'><stop offset='0' stop-color='#fff'/><stop offset='0.45' stop-color='#e8e8e8'/><stop offset='0.8' stop-color='#bbb'/><stop offset='1' stop-color='#888'/></radialGradient>
<linearGradient id='ring' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff'/><stop offset='1' stop-color='#ccc'/></linearGradient>
<filter id='bronze' filterUnits='userSpaceOnUse' x='0' y='0' width='{S}' height='{S}' color-interpolation-filters='sRGB'>{FILTER}</filter></defs>
<g filter='url(#bronze)'>{shapes}</g></svg>'''
open(cfg['out'],'w').write(svg)
