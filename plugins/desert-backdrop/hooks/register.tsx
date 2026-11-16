import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

const { theme } = makeColors({
  label: 'Desert dusk',
  only: 'dark',
  roles: { accent: '#e8895a', danger: '#e0594a', success: '#8fb36a', warning: '#e8b043', pro: '#b08bd0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1f1612',
        'surface-1': '#2a1d17',
        'surface-2': '#34251d',
        'surface-3': '#34251d',
        'text-primary': '#f6ebdc',
        'text-secondary': '#dccbb6',
        'text-muted': '#b9a690',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'desert' }, overrideColorScheme: 'dark' }

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const stars = Array.from({ length: 40 }, (_, i) => {
  const x = Math.round(rnd(i) * 1600)
  const y = Math.round(rnd(i + 50) * 330)
  const d = (rnd(i + 9) * 4).toFixed(1)
  return `<circle class="st" cx="${x}" cy="${y}" r="${(0.8 + rnd(i + 3) * 1.4).toFixed(1)}" style="animation-delay:-${d}s"/>`
}).join('')

const saguaro = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="#2a1712"><rect x="-14" y="-190" width="28" height="190" rx="14"/><path d="M-14 -110 H-48 a14 14 0 0 1 -14 -14 V-150 a14 14 0 0 1 28 0 V-124 H-14Z"/><path d="M14 -80 H48 a14 14 0 0 0 14 -14 V-130 a14 14 0 0 0 -28 0 V-94 H14Z"/></g>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.st{fill:#fff;animation:tw 5s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.9}50%{opacity:.2}}
.sun{animation:pulse 8s ease-in-out infinite;transform-origin:1180px 600px}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.12);opacity:.2}}
.d1{animation:drift 40s ease-in-out infinite alternate}
.d2{animation:drift 60s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translateX(-30px)}to{transform:translateX(30px)}}
.cl{animation:cloud 90s linear infinite}
@keyframes cloud{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
.sh{animation:shim 3s ease-in-out infinite}
@keyframes shim{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.03)}}
</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1230"/><stop offset=".45" stop-color="#6b2f4a"/><stop offset=".72" stop-color="#e0704a"/><stop offset="1" stop-color="#f2b366"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#sky)"/>
${stars}
<circle class="sun" cx="1180" cy="600" r="150" fill="#ffd08a"/>
<circle cx="1180" cy="600" r="70" fill="#ffe3b0"/>
<g class="cl" opacity=".3"><ellipse cx="0" cy="260" rx="160" ry="14" fill="#f2a27a"/><ellipse cx="90" cy="244" rx="90" ry="10" fill="#f2a27a"/></g>
<path class="d2" d="M-100 640 Q300 560 700 640 T1700 610 V900 H-100Z" fill="#a8523a"/>
<path class="d1" d="M-100 720 Q250 650 650 730 T1700 700 V900 H-100Z" fill="#7d3a2b"/>
${saguaro(220, 760, 1.1)}${saguaro(330, 790, 0.7)}${saguaro(1450, 770, 1)}
<path d="M-100 820 Q400 770 900 830 T1700 810 V900 H-100Z" fill="#3a1d16"/>
<rect class="sh" x="0" y="598" width="1600" height="3" fill="#ffe3b0" opacity=".25"/>
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
    if (String(e.props.scene) !== 'desert') {
      return next(e)
    }

    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A desert at dusk with a low sun, dunes and saguaros" isInteractive />
  })
}
