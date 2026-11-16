// The great wave, redrawn as flat woodblock shapes after the 1831 print. Only the spray moves.

type Pt = readonly [number, number]
type Seg = readonly [Pt, Pt, Pt, Pt]
type Claw = { x: number; y: number; deg: number; s: number; flip: boolean }

const FOAM = '#f6f1e0'
const DEEP = '#183b68'
const MID = '#41709e'
const PALE = '#a8c3d2'
const LINE = '#17335a'

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// A point on a cubic curve and the way the curve is heading there, in degrees.
const at = (s: Seg, t: number) => {
  const u = 1 - t
  const [a, b, c, d] = s
  const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0]
  const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]
  const dx = 3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0])
  const dy = 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])
  return { x, y, deg: (Math.atan2(dy, dx) * 180) / Math.PI }
}

const curves = (segs: readonly Seg[]) =>
  segs.map(s => `C${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]} ${s[3][0]} ${s[3][1]}`).join('')

const reversed = (segs: readonly Seg[]): Seg[] => [...segs].reverse().map(s => [s[3], s[2], s[1], s[0]] as Seg)

// The points of a line that runs beside a chain of curves, `d` to the right of its heading.
const besidePoints = (segs: readonly Seg[], d: number, t0: number, t1: number) => {
  const pts: string[] = []
  const last = segs.length - 1
  segs.forEach((s, k) => {
    for (let i = 0; i <= 24; i++) {
      const t = i / 24
      if (k === 0 && t < t0) continue
      if (k === last && t > t1) continue
      const p = at(s, t)
      const r = (p.deg * Math.PI) / 180
      pts.push(`${(p.x - Math.sin(r) * d).toFixed(0)} ${(p.y + Math.cos(r) * d).toFixed(0)}`)
    }
  })
  return pts
}

const beside = (segs: readonly Seg[], d: number, t0 = 0, t1 = 1) => `M${besidePoints(segs, d, t0, t1).join('L')}`

const band = (segs: readonly Seg[], near: number, far: number, t0 = 0, t1 = 1) =>
  `M${[...besidePoints(segs, near, t0, t1), ...besidePoints(segs, far, t0, t1).reverse()].join('L')}Z`

// Foam fingers along one curve: `n` of them between t0 and t1, `d` beside it.
const fingers = (
  seg: Seg,
  n: number,
  t0: number,
  t1: number,
  deg: (heading: number, i: number) => number,
  size: (i: number) => number,
  flip = false,
  d = 0,
): Claw[] =>
  Array.from({ length: n }, (_, i) => {
    const p = at(seg, t0 + ((t1 - t0) * i) / Math.max(1, n - 1))
    const r = (p.deg * Math.PI) / 180
    return { x: p.x - Math.sin(r) * d, y: p.y + Math.cos(r) * d, deg: deg(p.deg, i), s: size(i), flip }
  })

const HOOK = 'M0 -9C14 -15 32 -13 44 -3C53 5 56 17 50 27C49 17 43 9 33 6C21 3 10 7 0 9Z'
const CLAW = `<g id="k"><path d="${HOOK}"/><path d="${HOOK}" transform="translate(26 -9) rotate(-30) scale(.6)"/><path d="${HOOK}" transform="translate(40 2) rotate(22) scale(.5)"/></g>`

// Each finger starts a little inside the foam, and a plain dot over its root hides the seam.
const drawClaws = (list: readonly Claw[]) => {
  const claws = list
    .map(c => {
      const r = (c.deg * Math.PI) / 180
      const x = (c.x - Math.cos(r) * 6 * c.s).toFixed(0)
      const y = (c.y - Math.sin(r) * 6 * c.s).toFixed(0)
      const scale = c.flip ? `${c.s.toFixed(2)} ${(-c.s).toFixed(2)}` : c.s.toFixed(2)
      return `<use href="#k" transform="translate(${x} ${y}) rotate(${c.deg.toFixed(0)}) scale(${scale})"/>`
    })
    .join('')
  const roots = list
    .map(c => {
      const r = (c.deg * Math.PI) / 180
      const x = (c.x - Math.cos(r) * 3 * c.s).toFixed(0)
      const y = (c.y - Math.sin(r) * 3 * c.s).toFixed(0)
      return `<circle cx="${x}" cy="${y}" r="${(7.6 * c.s).toFixed(1)}"/>`
    })
    .join('')
  return `<g fill="${FOAM}" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round">${claws}</g><g fill="${FOAM}">${roots}</g>`
}

// ── The great wave ───────────────────────────────────────────────────────────
// Its top edge, left to right, ending at the tip of the curling lip.
const TOP: Seg[] = [
  [[-20, 350], [90, 300], [220, 215], [330, 160]],
  [[330, 160], [400, 125], [470, 102], [545, 105]],
  [[545, 105], [660, 110], [790, 175], [860, 265]],
  [[860, 265], [890, 305], [905, 355], [895, 405]],
]
// The underside of the lip, from the tip back into the hollow.
const ROOF: Seg[] = [
  [[895, 405], [880, 365], [845, 325], [800, 305]],
  [[800, 305], [740, 278], [670, 268], [610, 285]],
]
// The hollow face against the sky, down to the trough, then out along the trough.
const FACE: Seg[] = [
  [[610, 285], [572, 296], [565, 440], [610, 530]],
  [[610, 530], [641, 593], [700, 670], [780, 705]],
]
const TROUGH: Seg = [[780, 705], [860, 740], [960, 770], [1100, 790]]
// Where foam meets blue water: from the hollow, under the crest and down the wave's back.
const EDGE: Seg[] = [
  [[610, 285], [600, 250], [580, 215], [550, 200]],
  [[550, 200], [450, 195], [350, 225], [300, 290]],
  [[300, 290], [250, 360], [262, 440], [240, 520]],
  [[240, 520], [190, 600], [80, 650], [-20, 660]],
]

const WAVE = `M-20 350${curves(TOP)}${curves(ROOF)}${curves(FACE)}L900 1010L-20 1010Z`
const WATER = `M610 285${curves([...FACE, TROUGH])}L1100 1010L-20 1010L-20 660${curves(reversed(EDGE))}Z`
const CREST = `M-20 350${curves(TOP)}${curves(ROOF)}${curves(EDGE)}Z`

const waveStripes = [26, 60, 100, 142, 190, 236, 288, 338, 394, 448, 508, 566, 630]
  .map((d, i) =>
    i % 2 === 1
      ? `<path d="${beside([...FACE, TROUGH], d)}" stroke="${MID}" stroke-width="26"/>`
      : `<path d="${beside([...FACE, TROUGH], d)}" stroke="${PALE}" stroke-width="4"/>`,
  )
  .join('')

const waveClaws: Claw[] = [
  ...fingers(TOP[1], 4, 0.2, 0.95, h => h - 48, i => 0.6 + i * 0.08),
  ...fingers(TOP[2], 8, 0.08, 1, h => h - 30, i => 0.95 + i * 0.09),
  ...fingers(TOP[3], 4, 0.3, 1, h => h - 26, () => 1.55),
  ...fingers(ROOF[0], 4, 0.3, 1, (_, i) => 66 + i * 3, i => 1.4 - i * 0.05),
  ...fingers(ROOF[1], 6, 0.14, 0.92, (_, i) => 74 + i * 3, i => 1.25 - i * 0.05),
  ...fingers(EDGE[1], 5, 0.12, 0.9, (_, i) => 84 - i * 9, i => 1.0 + (i % 2) * 0.2),
  ...fingers(EDGE[2], 5, 0.1, 0.95, (_, i) => 24 + i * 7, i => 1.5 + (i % 2) * 0.3),
  ...fingers(EDGE[3], 5, 0.14, 0.9, (_, i) => 52 + i * 5, i => 1.4 + (i % 2) * 0.25),
]

// ── The swell on the right, which carries a boat ─────────────────────────────
const SWELL: Seg[] = [
  [[760, 1010], [800, 880], [900, 810], [1040, 790]],
  [[1040, 790], [1140, 782], [1240, 715], [1317, 686]],
  [[1317, 686], [1420, 648], [1530, 585], [1650, 498]],
]
const SWELL_BODY = `M760 1010${curves(SWELL)}L1650 1010Z`
const swellStripes = [44, 92, 150, 214, 286, 366]
  .map((d, i) => `<path d="${beside(SWELL, d)}" stroke="${i % 2 ? PALE : MID}" stroke-width="${i % 2 ? 4 : 24}"/>`)
  .join('')
const SWELL_FOAM = band(SWELL, -9, 24, 0.82)
const swellClaws: Claw[] = [
  ...fingers(SWELL[0], 3, 0.82, 0.98, (_, i) => 200 - i * 22, () => 1.25, true, 8),
  ...fingers(SWELL[1], 5, 0.15, 0.95, (_, i) => 132 - i * 4, i => 1.05 + (i % 2) * 0.2, false, 22),
  ...fingers(SWELL[2], 5, 0.12, 0.8, () => 124, i => 0.95 + (i % 2) * 0.2, false, 22),
]

// ── The small wave in front, which echoes the mountain ───────────────────────
const MOUND = 'M100 860C230 815 362 705 450 585C532 685 660 792 860 862L860 1010L100 1010Z'
const CAP_LEFT: Seg[] = [
  [[450, 692], [420, 706], [370, 736], [320, 766]],
  [[320, 766], [280, 786], [240, 798], [205, 800]],
]
const CAP_RIGHT: Seg[] = [
  [[450, 692], [480, 702], [520, 722], [560, 742]],
  [[560, 742], [600, 762], [660, 792], [740, 808]],
]
const CAP = `M205 800C290 765 380 680 450 585C515 665 610 750 740 808${curves(reversed(CAP_RIGHT))}${curves(CAP_LEFT)}Z`
const capClaws: Claw[] = [
  ...fingers(CAP_LEFT[0], 3, 0.25, 0.95, (_, i) => 108 + i * 6, () => 0.85, true),
  ...fingers(CAP_LEFT[1], 3, 0.3, 0.95, (_, i) => 122 + i * 5, () => 0.75, true),
  ...fingers(CAP_RIGHT[0], 3, 0.25, 0.95, (_, i) => 72 - i * 6, () => 0.85),
  ...fingers(CAP_RIGHT[1], 3, 0.3, 0.95, (_, i) => 58 - i * 5, () => 0.75),
]
const MOUND_LINE = 'M100 860C230 815 362 705 450 585C532 685 660 792 860 862'
const moundStripes = [150, 204, 262, 322, 388]
  .map((down, i) =>
    i % 2 === 0
      ? `<path d="${MOUND_LINE}" transform="translate(0 ${down})" stroke="${MID}" stroke-width="26"/>`
      : `<path d="${MOUND_LINE}" transform="translate(0 ${down})" stroke="${PALE}" stroke-width="4"/>`,
  )
  .join('')

// ── Boats: long, low and curved, with the rowers bent over their oars ────────
const boat = (bow: Pt, topC: Pt, sternTop: Pt, sternBottom: Pt, bottomC: Pt, crew: number, from: number, to: number) => {
  const rowers = Array.from({ length: crew }, (_, i) => {
    const t = from + ((to - from) * i) / Math.max(1, crew - 1)
    const u = 1 - t
    const x = u * u * bow[0] + 2 * u * t * topC[0] + t * t * sternTop[0]
    const y = u * u * bow[1] + 2 * u * t * topC[1] + t * t * sternTop[1]
    return `<ellipse cx="${x.toFixed(0)}" cy="${(y - 3).toFixed(0)}" rx="15" ry="11" fill="#35597f"/><circle cx="${(x - 9).toFixed(0)}" cy="${(y - 13).toFixed(0)}" r="6" fill="#ecdcb8"/>`
  }).join('')
  const hull = `M${bow[0]} ${bow[1]}Q${topC[0]} ${topC[1]} ${sternTop[0]} ${sternTop[1]}L${sternBottom[0]} ${sternBottom[1]}Q${bottomC[0]} ${bottomC[1]} ${bow[0]} ${bow[1]}Z`
  const rail = `M${bow[0]} ${bow[1]}Q${(topC[0] + bottomC[0]) / 2} ${(topC[1] + bottomC[1]) / 2} ${(sternTop[0] + sternBottom[0]) / 2} ${(sternTop[1] + sternBottom[1]) / 2}`
  return `<g stroke="${LINE}" stroke-width="1.2">${rowers}</g><path d="${hull}" fill="#e3caa0" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/><path d="${rail}" fill="none" stroke="#d3a184" stroke-width="7"/>`
}

const RIGHT_BOAT = boat([900, 742], [1240, 730], [1575, 500], [1592, 538], [1250, 772], 9, 0.24, 0.93)
const LEFT_BOAT = boat([-40, 690], [150, 726], [345, 772], [345, 804], [150, 766], 5, 0.15, 0.7)
const NEAR_BOAT = boat([640, 770], [880, 806], [1130, 876], [1138, 908], [880, 868], 8, 0.22, 0.93)

// ── Spray: the only thing that moves ─────────────────────────────────────────
const spray = Array.from({ length: 70 }, (_, i) => {
  const turn = ((-75 + rnd(i) * 200) * Math.PI) / 180
  const far = 45 + Math.pow(rnd(i + 40), 1.4) * 340
  const x = (850 + Math.cos(turn) * far).toFixed(0)
  const y = (300 + Math.sin(turn) * far * 0.85).toFixed(0)
  const r = (2 + rnd(i + 9) * 4.4).toFixed(1)
  const dur = (6 + rnd(i + 21) * 7).toFixed(1)
  const delay = (-rnd(i + 5) * 13).toFixed(1)
  return `<circle class="s s${i % 3}" cx="${x}" cy="${y}" r="${r}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`
}).join('')

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.s{fill:${FOAM};stroke:${LINE};stroke-width:.5;animation:a 8s ease-in-out infinite}
.s1{animation-name:b}.s2{animation-name:c}
@keyframes a{0%{opacity:0;transform:translate(-16px,12px)}25%,70%{opacity:1}100%{opacity:0;transform:translate(24px,-18px)}}
@keyframes b{0%{opacity:0;transform:translate(-12px,-6px)}25%,70%{opacity:1}100%{opacity:0;transform:translate(28px,10px)}}
@keyframes c{0%{opacity:0;transform:translate(-6px,-16px)}25%,70%{opacity:1}100%{opacity:0;transform:translate(14px,28px)}}
@media (prefers-reduced-motion:reduce){.s{animation:none}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eadcb8"/><stop offset=".33" stop-color="#e5d4ac"/><stop offset=".5" stop-color="#b6aa91"/><stop offset=".63" stop-color="#7e7b73"/><stop offset=".72" stop-color="#62615d"/></linearGradient>
<linearGradient id="cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eadcb8"/><stop offset=".3" stop-color="#eee2c2"/><stop offset=".5" stop-color="#ece0c0"/></linearGradient>
<clipPath id="w"><path d="${WATER}"/></clipPath>
<clipPath id="m"><path d="${MOUND}"/></clipPath>
<clipPath id="r"><path d="${SWELL_BODY}"/></clipPath>
${CLAW}
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<path d="M1000 -10C960 40 900 60 905 120C860 150 860 215 905 240C890 290 925 330 965 330C975 380 1010 420 1050 428C1080 395 1140 385 1180 408C1204 360 1262 344 1322 376C1370 322 1450 318 1490 372C1545 365 1575 405 1620 430V-10Z" fill="url(#cloud)"/>
<path d="M905 712C990 690 1048 656 1078 618L1090 612L1102 618C1132 656 1190 690 1275 712Z" fill="#3c4d68" stroke="${LINE}" stroke-width="1.2"/>
<path d="M1078 618L1090 612L1102 618C1112 632 1124 646 1138 658L1122 650L1114 664L1101 646L1090 662L1079 646L1066 664L1058 650L1042 658C1056 646 1068 632 1078 618Z" fill="${FOAM}"/>
<path d="M540 700C800 712 1000 694 1250 700L1650 700V1010H540Z" fill="${DEEP}"/>
<path d="${WAVE}" fill="${DEEP}"/>
<g clip-path="url(#w)" fill="none">${waveStripes}</g>
<path d="${SWELL_BODY}" fill="${DEEP}"/>
<g clip-path="url(#r)" fill="none">${swellStripes}</g>
${RIGHT_BOAT}
<path d="${SWELL_FOAM}" fill="${FOAM}" stroke="${LINE}" stroke-width="1.6" stroke-linejoin="round"/>
${drawClaws(swellClaws)}
<path d="${CREST}" fill="${FOAM}" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>
<g fill="none" stroke="${PALE}" stroke-linecap="round"><path d="${beside(TOP.slice(0, 3), 30, 0.05, 0.8)}" stroke-width="7"/><path d="${beside(TOP.slice(0, 2), 84, 0.05, 0.9)}" stroke-width="5"/><path d="${beside(TOP.slice(0, 1), 150, 0.05, 0.95)}" stroke-width="5"/></g>
${drawClaws(waveClaws)}
${LEFT_BOAT}
<path d="${MOUND}" fill="${DEEP}"/>
<g clip-path="url(#m)" fill="none" stroke-linejoin="round">${moundStripes}</g>
<path d="${CAP}" fill="${FOAM}" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>
<g fill="none" stroke="${PALE}" stroke-linecap="round" stroke-width="6"><path d="M450 628C410 680 350 736 280 776"/><path d="M450 628C492 678 560 734 660 782"/></g>
${drawClaws(capClaws)}
${NEAR_BOAT}
${spray}
</svg>`
