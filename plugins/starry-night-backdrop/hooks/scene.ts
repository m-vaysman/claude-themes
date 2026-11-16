// A night sky after the famous 1889 painting, built from brush-stroke dashes that swirl slowly.

type Eddy = { x: number; y: number; r: number }
type Star = { x: number; y: number; s: number; core: string }

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const SWIRL: Eddy = { x: 730, y: 390, r: 215 }
const CURL: Eddy = { x: 1030, y: 480, r: 135 }
const MOON: Eddy = { x: 1400, y: 140, r: 118 }

const STARS: Star[] = [
  { x: 95, y: 150, s: 0.9, core: '#fff3b0' },
  { x: 60, y: 420, s: 0.7, core: '#f6d860' },
  { x: 420, y: 95, s: 1.0, core: '#f6d860' },
  { x: 505, y: 215, s: 0.75, core: '#fff3b0' },
  { x: 445, y: 470, s: 1.25, core: '#fbfbe8' },
  { x: 640, y: 105, s: 0.8, core: '#f6d860' },
  { x: 880, y: 100, s: 1.0, core: '#f2c14a' },
  { x: 1090, y: 110, s: 0.85, core: '#fff3b0' },
  { x: 1215, y: 300, s: 1.0, core: '#f6d860' },
  { x: 1270, y: 560, s: 0.7, core: '#fff3b0' },
  { x: 1530, y: 380, s: 0.8, core: '#f6d860' },
]

// Everything the wind has to flow around.
const EDDIES: Eddy[] = [SWIRL, CURL, MOON, ...STARS.map(s => ({ x: s.x, y: s.y, r: 56 * s.s }))]

// ── The wind: rows of brush strokes that bend around every eddy ──────────────
const flow = (y0: number, j: number) => {
  const pts: [number, number][] = []
  for (let x = -64; x <= 1664; x += 32) {
    let y = y0 + 13 * Math.sin(x / 230 + j * 1.3) + 6 * Math.sin(x / 90 + j * 2.1)
    for (const e of EDDIES) {
      const d = Math.hypot(x - e.x, y0 - e.y)
      y += (y0 >= e.y ? 1 : -1) * e.r * 0.95 * Math.exp(-((d / (e.r * 1.05)) ** 2))
    }
    pts.push([x, y])
  }
  let d = `M${pts[0][0]} ${pts[0][1].toFixed(0)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += `Q${pts[i][0]} ${pts[i][1].toFixed(0)} ${mx} ${my.toFixed(0)}`
  }
  return d
}

const BLUES = ['#2a4fa8', '#3766c4', '#1e3c8e', '#4a7fd0', '#25479c']
const LIGHTS = ['#8fb4e6', '#c9dcee', '#6d9ad8', '#e9e3b6']
const GLOW = ['#cfe0ea', '#f0e6b0', '#a9c8ec']
// Dash and gap pairs whose sum divides 600, so a 600-unit slide loops without a jump.
const DASHES = ['26 14', '34 16', '40 20', '50 25']

const wind = Array.from({ length: 21 }, (_, j) => {
  const y0 = 22 + j * 31
  const low = y0 > 560
  const d = flow(y0, j)
  const main = low ? GLOW[j % 3] : BLUES[j % 5]
  const light = low ? '#f6f0cf' : LIGHTS[j % 4]
  const dur = 90 + (j % 5) * 14
  return `<path class="f" d="${d}" stroke="${main}" stroke-width="14" stroke-dasharray="${DASHES[j % 4]}" style="animation-duration:${dur}s"/><path class="f" d="${d}" transform="translate(0 10)" stroke="${light}" stroke-width="5" stroke-dasharray="${DASHES[(j + 2) % 4]}" style="animation-duration:${dur + 30}s"/>`
}).join('')

// ── Swirls: spiral arms that turn as one ─────────────────────────────────────
const arm = (R: number, turns: number, phase: number) => {
  const pts: string[] = []
  const end = turns * 2 * Math.PI
  for (let a = 1; a <= end; a += 0.15) {
    const r = (R * a) / end
    pts.push(`${(Math.cos(a + phase) * r).toFixed(0)} ${(Math.sin(a + phase) * r).toFixed(0)}`)
  }
  return `M${pts.join('L')}`
}

const swirl = (e: Eddy, spin: string, secs: number, eye: string) =>
  `<g transform="translate(${e.x} ${e.y})"><circle r="${e.r}" fill="url(#eddy)"/><g class="${spin}" style="animation-duration:${secs}s" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="${arm(e.r, 3, 0)}" stroke="#a9c8ec" stroke-width="15" stroke-dasharray="40 16"/>` +
  `<path d="${arm(e.r, 3, 2.1)}" stroke="#4f80d2" stroke-width="15" stroke-dasharray="52 18"/>` +
  `<path d="${arm(e.r, 3, 4.2)}" stroke="#f1e7b4" stroke-width="9" stroke-dasharray="30 22"/>` +
  `<path d="${arm(e.r * 0.96, 3, 1.05)}" stroke="#1e3c8e" stroke-width="7" stroke-dasharray="34 20"/>` +
  `<circle r="13" fill="${eye}" stroke="none"/></g></g>`

// ── Stars and the moon: a bright core inside rings of dashes that turn ───────
const ring = (r: number, color: string, width: number, spin: string, secs: number) => {
  const round = 2 * Math.PI * r
  const n = Math.max(5, Math.round(round / 30))
  const step = round / n
  return `<circle class="${spin}" r="${r}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${(step * 0.66).toFixed(1)} ${(step * 0.34).toFixed(1)}" style="animation-duration:${secs}s"/>`
}

const stars = STARS.map((s, i) => {
  const secs = 70 + (i % 4) * 16
  return (
    `<g transform="translate(${s.x} ${s.y}) scale(${s.s})" fill="none" stroke-linecap="round"><circle r="56" fill="#2c56b4" opacity=".55"/>` +
    ring(46, '#5f8fdc', 9, 'cw', secs + 30) +
    ring(33, '#d6e2c4', 8, 'ccw', secs) +
    ring(21, '#f2c94c', 8, 'cw', secs - 20) +
    `<circle r="12" fill="${s.core}"/></g>`
  )
}).join('')

const moon =
  `<g transform="translate(${MOON.x} ${MOON.y})" fill="none" stroke-linecap="round"><circle r="118" fill="#3a66b8" opacity=".55"/>` +
  ring(104, '#7fa8dc', 10, 'cw', 150) +
  ring(88, '#d9e2b0', 10, 'ccw', 120) +
  ring(72, '#f2d25a', 10, 'cw', 100) +
  `<circle r="60" fill="#f7e27a"/><circle r="44" fill="#ee9f33"/><circle cx="-17" cy="-3" r="39" fill="#f7e27a"/></g>`

// ── The land: hills, a village asleep, and the cypress ───────────────────────
const RIDGE = 'M-20 690C100 660 220 715 330 700C420 650 520 640 600 670C680 700 740 690 820 660C900 630 980 650 1060 680C1160 640 1260 610 1360 640C1450 665 1530 640 1620 600'
const hillLines = [24, 50, 78]
  .map((down, i) => `<path d="${RIDGE}" transform="translate(0 ${down})" stroke="${i % 2 ? '#16306f' : '#4a78c8'}" stroke-width="8" stroke-dasharray="36 18"/>`)
  .join('')

const HOUSES: [number, number, number, number][] = [
  [470, 822, 64, 40], [548, 806, 74, 46], [636, 820, 58, 38], [706, 800, 84, 50], [802, 818, 56, 40],
  [990, 806, 78, 46], [1076, 820, 62, 40], [1146, 800, 90, 52], [1244, 816, 66, 42], [1316, 804, 80, 48],
  [1404, 820, 70, 40], [1480, 804, 86, 50], [1572, 816, 60, 44],
]
const village = HOUSES.map(([x, y, w, h], i) => {
  const lit = i % 3 !== 1
  const roof = i % 2 ? '#2a4a9c' : '#0e1a44'
  const window = lit ? `<rect x="${x + w * 0.32}" y="${y + h * 0.34}" width="13" height="15" fill="#f4c94f" stroke="#0a1232" stroke-width="1.5"/>` : ''
  return `<rect x="${x}" y="${y}" width="${w}" height="${h + 30}" fill="#1a2f6b"/><path d="M${x - 6} ${y}L${x + w / 2} ${y - h * 0.6}L${x + w + 6} ${y}Z" fill="${roof}"/>${window}`
}).join('')

const CHURCH =
  '<rect x="862" y="800" width="104" height="80" fill="#1a2f6b"/><path d="M856 800L914 768L972 800Z" fill="#0e1a44"/>' +
  '<rect x="874" y="742" width="30" height="80" fill="#162a62"/><path d="M868 744L889 610L910 744Z" fill="#0e1a44"/>' +
  '<rect x="882" y="766" width="12" height="18" fill="#f4c94f" stroke="#0a1232" stroke-width="1.5"/>'

const bushes = Array.from({ length: 38 }, (_, i) => {
  const x = -20 + i * 44 + rnd(i) * 20
  const y = 905 + rnd(i + 50) * 40
  const r = 34 + rnd(i + 9) * 26
  return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${i % 3 ? '#0d2238' : '#113038'}"/>`
}).join('')

const CYPRESS =
  'M150 1010C150 900 175 820 190 740C170 700 185 640 205 590C190 540 205 470 225 420C212 370 228 300 240 250C235 200 245 130 258 70C268 130 285 190 280 250C300 300 312 360 300 420C325 480 335 540 322 600C348 660 356 730 345 790C362 860 372 940 372 1010Z'
const cypressStrokes = [
  ['M185 990C200 820 222 640 240 460S252 240 256 130', '#25422c'],
  ['M220 995C228 830 244 660 256 480S262 260 260 150', '#3b2e1c'],
  ['M260 995C262 840 268 680 272 520S274 320 266 200', '#1f3a27'],
  ['M300 995C298 860 300 720 296 580S292 420 282 320', '#3b2e1c'],
  ['M338 995C334 900 330 800 322 700S312 560 304 480', '#25422c'],
]
  .map(([d, color]) => `<path d="${d}" stroke="${color}" stroke-width="10" stroke-dasharray="42 18"/>`)
  .join('')

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.f{fill:none;stroke-linecap:round;animation:slide 100s steps(900) infinite}
@keyframes slide{to{stroke-dashoffset:-600}}
.cw,.ccw{animation:cw 120s steps(1500) infinite}
.ccw{animation-name:ccw}
@keyframes cw{to{transform:rotate(360deg)}}
@keyframes ccw{to{transform:rotate(-360deg)}}
@media (prefers-reduced-motion:reduce){.f,.cw,.ccw{animation:none}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1b4c"/><stop offset=".45" stop-color="#172c78"/><stop offset=".7" stop-color="#284c9c"/></linearGradient>
<radialGradient id="eddy"><stop offset="0" stop-color="#6f9be0"/><stop offset=".6" stop-color="#2c50a8"/><stop offset="1" stop-color="#1c3780"/></radialGradient>
<clipPath id="h"><path d="${RIDGE}L1620 860L-20 860Z"/></clipPath>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${wind}
${swirl(SWIRL, 'cw', 170, '#f1e7b4')}
${swirl(CURL, 'ccw', 130, '#d6e2c4')}
${stars}
${moon}
<path d="${RIDGE}L1620 860L-20 860Z" fill="#1c3a8c"/>
<g clip-path="url(#h)" fill="none" stroke-linecap="round">${hillLines}</g>
<path d="${RIDGE}" fill="none" stroke="#0c1a45" stroke-width="6" stroke-linecap="round"/>
<path d="M-20 790C300 750 700 772 900 762C1100 752 1350 734 1620 752L1620 1010L-20 1010Z" fill="#14296a"/>
<g stroke="#0a1232" stroke-width="2.5" stroke-linejoin="round">${village}${CHURCH}</g>
<rect x="-20" y="930" width="1640" height="80" fill="#0b1a2e"/>
${bushes}
<path d="M300 1010C312 930 332 880 348 838C364 880 388 930 398 1010Z" fill="#0e1813"/>
<path d="${CYPRESS}" fill="#101a16"/>
<g fill="none" stroke-linecap="round">${cypressStrokes}</g>
</svg>`
