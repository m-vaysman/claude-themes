import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

const { theme } = makeColors({
  label: 'Solar system',
  only: 'dark',
  roles: { accent: '#7eb6ff', danger: '#e0645c', success: '#6fbfa0', warning: '#e0b15a', pro: '#b9a6f0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080b14',
        'surface-1': '#101624',
        'surface-2': '#171e30',
        'surface-3': '#171e30',
        'text-primary': '#eef2fb',
        'text-secondary': '#c9d2e6',
        'text-muted': '#9aa6c2',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'solar-system' }, overrideColorScheme: 'dark' }

// Deterministic pseudo-random so the scene is stable between draws.
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const SY = 0.34
const INV = (1 / SY).toFixed(4)

const stars = Array.from({ length: 108 }, (_, i) => {
  const x = Math.round(rnd(i) * 1600)
  const y = Math.round(rnd(i + 50) * 900)
  const r = (0.4 + rnd(i + 3) * 1.3).toFixed(2)
  const d = (rnd(i + 9) * 16).toFixed(2)
  const tint = rnd(i + 21)
  const fill = tint > 0.93 ? '#ffe4c4' : tint > 0.86 ? '#c6d4ff' : '#fff'
  const o = (0.2 + rnd(i + 27) * 0.62).toFixed(2)
  const tw = rnd(i + 33) > 0.3
  const halo =
    rnd(i + 44) > 0.96
      ? `<circle cx="${x}" cy="${y}" r="${(Number(r) * 3.4).toFixed(2)}" fill="${fill}" opacity=".13"/>`
      : ''
  const cls = tw ? ` class="st" style="animation-delay:-${d}s"` : ''
  return `${halo}<circle${cls} cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${o}"/>`
}).join('')

const dust = Array.from({ length: 34 }, (_, i) => {
  const t = rnd(i + 700)
  const x = -60 + t * 1720
  const y = 430 + (x - 800) * Math.tan((-22 * Math.PI) / 180) + (rnd(i + 770) - 0.5) * (40 + rnd(i + 820) * 120)
  const r = (0.35 + rnd(i + 860) * 0.85).toFixed(2)
  const o = (0.12 + rnd(i + 900) * 0.4).toFixed(2)
  return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="#d5def8" opacity="${o}"/>`
}).join('')

const belt = Array.from({ length: 46 }, (_, i) => {
  const a = rnd(i + 3) * Math.PI * 2
  const rad = 368 + rnd(i + 17) * 58
  const x = (Math.cos(a) * rad).toFixed(1)
  const y = (Math.sin(a) * rad).toFixed(1)
  const r = (1.7 + rnd(i + 29) * 1.7).toFixed(2)
  const o = (0.35 + rnd(i + 41) * 0.5).toFixed(2)
  const fill = rnd(i + 53) > 0.7 ? '#d9cbb6' : rnd(i + 59) > 0.4 ? '#a89880' : '#7c7368'
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${o}"/>`
}).join('')

const orbiting = (radius: number, angle: number, dur: number, markup: string) =>
  `<g transform="rotate(${angle})"><g class="spin" style="animation-duration:${dur}s"><circle cx="0" cy="0" r="${radius + 160}" fill="rgba(0,0,0,0)"/><g transform="translate(${radius},0)"><g class="anti" style="animation-duration:${dur}s"><g transform="rotate(${-angle})"><g transform="scale(1,${INV})">${markup}</g></g></g></g></g></g>`

const moon = (dist: number, r: number, dur: number, fill: string) =>
  `<g class="spin" style="animation-duration:${dur}s"><circle cx="0" cy="0" r="${dist + r + 1}" fill="rgba(0,0,0,0)"/><circle cx="${dist}" cy="0" r="${r}" fill="${fill}"/></g>`

const lit = (r: number) => `<circle r="${r}" fill="url(#shade)"/><circle r="${r}" fill="url(#spec)"/>`

const orbits = [140, 200, 265, 330, 480, 560, 640, 715]
  .map(
    r =>
      `<circle cx="0" cy="0" r="${r}" fill="none" stroke="#b7c4e2" stroke-opacity=".15" stroke-width="1" vector-effect="non-scaling-stroke"/>`,
  )
  .join('')

const mercury = `<circle r="4.8" fill="url(#mer)"/><circle cx="-1.4" cy="-0.4" r="0.85" fill="#5c5a56" opacity=".6"/><circle cx="1.5" cy="1.1" r="0.5" fill="#4a4844" opacity=".55"/><circle cx="0.2" cy="-1.5" r="0.4" fill="#6e6b66" opacity=".45"/>${lit(4.8)}`

const venus = `<circle r="7.4" fill="url(#ven)"/><g class="drift" style="animation-duration:52s" fill="#fff6e4" opacity=".3"><ellipse cx="-1.8" cy="-2.1" rx="4" ry="1.05"/><ellipse cx="1.5" cy="0.7" rx="4.6" ry="1.1"/><ellipse cx="-0.4" cy="2.8" rx="3.4" ry="0.85"/></g>${lit(7.4)}<circle r="8.15" fill="none" stroke="#f3e2bc" stroke-width="1.15" opacity=".4"/>`

const earth = `<circle r="8" fill="url(#ear)"/><g fill="#2f8f4e"><ellipse cx="-2.3" cy="0.3" rx="1.7" ry="3"/><ellipse cx="1.7" cy="-1.1" rx="2.2" ry="1.7"/><ellipse cx="2.1" cy="2.2" rx="1.25" ry="1.6"/><ellipse cx="-0.3" cy="-2.5" rx="1.45" ry="0.95"/></g><ellipse cx="0.1" cy="-6.2" rx="1.9" ry="0.85" fill="#f4fbff" opacity=".92"/><g class="drift" style="animation-duration:32s" fill="#fff" opacity=".7"><ellipse cx="-2.8" cy="-2.2" rx="2.3" ry="0.85"/><ellipse cx="1.5" cy="-0.2" rx="2.6" ry="0.8"/><ellipse cx="-1" cy="2.5" rx="2.1" ry="0.65"/><ellipse cx="3" cy="2" rx="1.5" ry="0.55"/></g>${lit(8)}<circle r="8.7" fill="none" stroke="#9fd4ff" stroke-width="1.15" opacity=".5"/>${moon(14.5, 2.1, 22, '#d5dbe6')}`

const mars = `<circle r="6.2" fill="url(#mar)"/><ellipse cx="-1.6" cy="-0.4" rx="1.5" ry="1.05" fill="#8f341c" opacity=".55"/><ellipse cx="1.2" cy="1.8" rx="1.7" ry="0.65" fill="#efd0b0" opacity=".4"/><ellipse cx="0.2" cy="-4.7" rx="1.5" ry="0.65" fill="#f6ebe4" opacity=".8"/>${lit(6.2)}`

const jupiter = `<circle r="20" fill="url(#jup)"/><ellipse cx="-6" cy="3.4" rx="5.2" ry="3.1" fill="#c44536"/><ellipse cx="-6.5" cy="3" rx="2.5" ry="1.45" fill="#e07868" opacity=".8"/>${lit(20)}${moon(28, 2, 16, '#e6c99a')}${moon(40, 1.45, 28, '#e7e0d4')}`

const saturn = `<g transform="rotate(-22)"><ellipse rx="40" ry="13.5" fill="none" stroke="#e4d5b4" stroke-width="8" opacity=".72"/><ellipse rx="40" ry="13.5" fill="none" stroke="#2a241c" stroke-width="1.35" opacity=".55"/><ellipse rx="46" ry="15.5" fill="none" stroke="#f3ead8" stroke-width="1.1" opacity=".4"/></g><circle r="15" fill="url(#sat)"/><rect x="-11" y="-3.2" width="22" height="1.7" fill="#f4ead4" opacity=".45"/><rect x="-10" y="2.4" width="20" height="1.5" fill="#b8926a" opacity=".4"/>${lit(15)}<g transform="rotate(-22)"><path d="M-40 0 A40 13.5 0 0 1 40 0" fill="none" stroke="#f0e4c8" stroke-width="7.5" stroke-linecap="butt"/><path d="M-40 0 A40 13.5 0 0 1 40 0" fill="none" stroke="#2a241c" stroke-width="1.2" opacity=".5"/><path d="M-46 0 A46 15.5 0 0 1 46 0" fill="none" stroke="#f7f1e4" stroke-width="1.1" opacity=".55"/></g>${moon(52, 2.3, 32, '#e4c49a')}`

const uranus = `<g transform="rotate(74)"><ellipse rx="19" ry="4.6" fill="none" stroke="#d7f7f4" stroke-width="1.6" opacity=".7"/></g><circle r="10.4" fill="url(#ura)"/>${lit(10.4)}<g transform="rotate(74)"><path d="M-19 0 A19 4.6 0 0 1 19 0" fill="none" stroke="#e7fffd" stroke-width="1.7" opacity=".8"/></g>`

const neptune = `<circle r="10.2" fill="url(#nep)"/><ellipse cx="-3.2" cy="1.6" rx="2.3" ry="1.35" fill="#0c1848" opacity=".62"/>${lit(10.2)}${moon(16.5, 1.45, 26, '#c9d4ea')}`

const rocks = [
  [392, 18, 2.2, '#e0d2c0'],
  [414, 96, 1.7, '#8d8478'],
  [374, 210, 1.9, '#cbbba6'],
  [428, 300, 1.55, '#a09080'],
]
  .map(([rad, ang, r, fill]) => orbiting(Number(rad), Number(ang), 140, `<circle r="${r}" fill="${fill}"/>${lit(Number(r))}`))
  .join('')

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.st{fill:#fff;animation:tw 12s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.8}50%{opacity:.18}}
.corona,.halo{transform-origin:800px 450px;animation:pulse 18s ease-in-out infinite}
.halo{animation-duration:14s}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.62}50%{transform:scale(1.12);opacity:.9}}
.spin{transform-box:fill-box;transform-origin:center;animation:spin linear infinite}
.anti{transform-box:fill-box;transform-origin:center;animation:spin linear infinite reverse}
@keyframes spin{to{transform:rotate(360deg)}}
.drift{animation:drift 40s ease-in-out infinite alternate}
@keyframes drift{from{transform:translateX(-1.6px)}to{transform:translateX(1.6px)}}
.belt{transform-box:fill-box;transform-origin:center;animation:spin 140s linear infinite}
.comet{animation:comet 68s linear infinite}
@keyframes comet{0%,100%{transform:translate(0,0);opacity:.85}7%{opacity:.85}20%{transform:translate(1080px,460px);opacity:0}21%{opacity:0}90%{transform:translate(-40px,-16px);opacity:0}}
</style>
<defs>
<radialGradient id="sky" cx="50%" cy="46%" r="78%"><stop offset="0" stop-color="#141a2c"/><stop offset=".5" stop-color="#0a0e1a"/><stop offset="1" stop-color="#04060e"/></radialGradient>
<radialGradient id="mw" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#d5def8" stop-opacity=".22"/><stop offset=".6" stop-color="#8ea0cc" stop-opacity=".07"/><stop offset="1" stop-color="#8ea0cc" stop-opacity="0"/></radialGradient>
<radialGradient id="mwCore" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f4f7ff" stop-opacity=".2"/><stop offset="1" stop-color="#f4f7ff" stop-opacity="0"/></radialGradient>
<radialGradient id="corona" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd7a4" stop-opacity=".5"/><stop offset=".28" stop-color="#ffb15e" stop-opacity=".14"/><stop offset=".6" stop-color="#ff9a4a" stop-opacity=".04"/><stop offset="1" stop-color="#ff9a4a" stop-opacity="0"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3d8" stop-opacity=".7"/><stop offset=".55" stop-color="#ffc56a" stop-opacity=".16"/><stop offset="1" stop-color="#ffc56a" stop-opacity="0"/></radialGradient>
<radialGradient id="sun" cx="40%" cy="38%" r="62%"><stop offset="0" stop-color="#fffaf2"/><stop offset=".42" stop-color="#ffe2aa"/><stop offset=".78" stop-color="#ffb44c"/><stop offset="1" stop-color="#f08c2c"/></radialGradient>
<radialGradient id="shade" cx="34%" cy="31%" r="72%"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity=".06"/><stop offset=".8" stop-color="#000" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity=".84"/></radialGradient>
<radialGradient id="spec" cx="32%" cy="30%" r="48%"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="mer" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#f3f1ec"/><stop offset=".4" stop-color="#a9a7a1"/><stop offset=".7" stop-color="#5e5c58"/><stop offset="1" stop-color="#1c1b19"/></radialGradient>
<radialGradient id="ven" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#fff8ea"/><stop offset=".42" stop-color="#f0dcb4"/><stop offset=".72" stop-color="#b99262"/><stop offset="1" stop-color="#5c482c"/></radialGradient>
<radialGradient id="ear" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#8ec8f8"/><stop offset=".4" stop-color="#1d6cc2"/><stop offset=".72" stop-color="#0c3b82"/><stop offset="1" stop-color="#061018"/></radialGradient>
<radialGradient id="mar" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#f0b090"/><stop offset=".42" stop-color="#d2653c"/><stop offset=".72" stop-color="#8a341c"/><stop offset="1" stop-color="#2c100c"/></radialGradient>
<linearGradient id="jup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9926a"/><stop offset=".1" stop-color="#b9926a"/><stop offset=".1" stop-color="#f3e6d0"/><stop offset=".2" stop-color="#f3e6d0"/><stop offset=".2" stop-color="#c4844e"/><stop offset=".33" stop-color="#d49262"/><stop offset=".33" stop-color="#f7f0e2"/><stop offset=".46" stop-color="#e7d3b2"/><stop offset=".46" stop-color="#a86b40"/><stop offset=".56" stop-color="#c48455"/><stop offset=".56" stop-color="#edd9b8"/><stop offset=".7" stop-color="#f0e0c6"/><stop offset=".7" stop-color="#d09a68"/><stop offset=".82" stop-color="#e2bc90"/><stop offset=".82" stop-color="#f3e6cc"/><stop offset="1" stop-color="#b88858"/></linearGradient>
<radialGradient id="sat" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#fff6e4"/><stop offset=".45" stop-color="#ecd7ae"/><stop offset=".75" stop-color="#b89260"/><stop offset="1" stop-color="#4a3824"/></radialGradient>
<radialGradient id="ura" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#e9fffd"/><stop offset=".45" stop-color="#9fe4e0"/><stop offset=".75" stop-color="#3d8e92"/><stop offset="1" stop-color="#102e34"/></radialGradient>
<radialGradient id="nep" cx="34%" cy="32%" r="70%"><stop offset="0" stop-color="#9eb6ff"/><stop offset=".4" stop-color="#2a4ec8"/><stop offset=".72" stop-color="#142e86"/><stop offset="1" stop-color="#070e22"/></radialGradient>
<linearGradient id="tail" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#b9d4ff" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<g transform="rotate(-22 800 430)"><ellipse cx="800" cy="430" rx="980" ry="168" fill="url(#mw)"/><ellipse cx="810" cy="422" rx="720" ry="42" fill="url(#mwCore)"/></g>
${dust}
${stars}
<circle class="corona" cx="800" cy="450" r="176" fill="url(#corona)"/>
<circle class="halo" cx="800" cy="450" r="78" fill="url(#halo)"/>
<circle cx="800" cy="450" r="36" fill="url(#sun)"/>
<circle cx="812" cy="442" r="3.2" fill="#e89848" opacity=".35"/><circle cx="790" cy="460" r="2.1" fill="#e08838" opacity=".3"/><circle cx="806" cy="464" r="1.4" fill="#d08040" opacity=".28"/>
<g transform="translate(800,450) scale(1,${SY})">
${orbits}
<g class="belt"><circle cx="0" cy="0" r="520" fill="rgba(0,0,0,0)"/>${belt}</g>
${orbiting(140, 20, 36, mercury)}
${orbiting(200, 155, 56, venus)}
${orbiting(265, 220, 80, earth)}
${orbiting(330, 335, 108, mars)}
${rocks}
${orbiting(480, 55, 176, jupiter)}
${orbiting(560, 200, 236, saturn)}
${orbiting(640, 105, 300, uranus)}
${orbiting(715, 300, 380, neptune)}
</g>
<g class="comet"><path d="M292 168 C210 122 130 78 36 42" fill="none" stroke="url(#tail)" stroke-width="2.2" stroke-linecap="round"/><path d="M292 168 C230 138 168 108 88 74" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".18"/><circle cx="292" cy="168" r="2.7" fill="#fff"/><circle cx="292" cy="168" r="6.5" fill="#fff" opacity=".28"/></g>
</svg>`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    // Several themes can be installed at once: draw only when this one is the chosen scene.
    if (String(e.props.scene) !== 'solar-system') {
      return next(e)
    }

    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="The solar system in deep space: a glowing sun, eight planets, moons, rings and a comet" isInteractive />
  })
}
