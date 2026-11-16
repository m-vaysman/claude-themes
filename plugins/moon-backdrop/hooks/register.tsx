import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

const { theme } = makeColors({
  label: 'Moonlight',
  only: 'dark',
  roles: { accent: '#8fb4ff', danger: '#e0646a', success: '#6fc2a0', warning: '#e0c070', pro: '#b9a0f0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b1020',
        'surface-1': '#111833',
        'surface-2': '#18214a',
        'surface-3': '#18214a',
        'text-primary': '#eef2fb',
        'text-secondary': '#c9d2e8',
        'text-muted': '#a3aecb',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'moon' }, overrideColorScheme: 'dark' }

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const stars = Array.from({ length: 70 }, (_, i) => {
  const x = Math.round(rnd(i) * 1600)
  const y = Math.round(rnd(i + 50) * 600)
  const d = (rnd(i + 9) * 5).toFixed(1)
  return `<circle class="st" cx="${x}" cy="${y}" r="${(0.7 + rnd(i + 3) * 1.5).toFixed(1)}" style="animation-delay:-${d}s"/>`
}).join('')

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.st{fill:#fff;animation:tw 5s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.9}50%{opacity:.2}}
.halo{animation:glow 7s ease-in-out infinite;transform-origin:1150px 250px}
@keyframes glow{0%,100%{transform:scale(1);opacity:.28}50%{transform:scale(1.1);opacity:.4}}
.c1{animation:cloud 70s linear infinite}
.c2{animation:cloud 110s linear infinite;animation-delay:-50s}
@keyframes cloud{from{transform:translateX(-500px)}to{transform:translateX(2100px)}}
.sh{animation:shoot 12s linear infinite;opacity:0}
@keyframes shoot{0%{transform:translate(0,0);opacity:0}2%{opacity:1}8%{transform:translate(-420px,240px);opacity:0}100%{opacity:0}}
.rf{animation:rip 4s ease-in-out infinite;transform-origin:1150px 800px}
@keyframes rip{0%,100%{transform:scaleX(1);opacity:.35}50%{transform:scaleX(.8);opacity:.2}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b1a"/><stop offset=".6" stop-color="#121d44"/><stop offset="1" stop-color="#26376b"/></linearGradient>
<radialGradient id="hg"><stop offset="0" stop-color="#dfe8ff" stop-opacity=".9"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/>
${stars}
<circle class="halo" cx="1150" cy="250" r="260" fill="url(#hg)"/>
<circle cx="1150" cy="250" r="95" fill="#eef2fb"/>
<circle cx="1120" cy="225" r="16" fill="#cfd8ec"/><circle cx="1178" cy="285" r="22" fill="#cfd8ec"/><circle cx="1185" cy="212" r="9" fill="#cfd8ec"/><circle cx="1105" cy="290" r="11" fill="#cfd8ec"/>
<g class="sh"><path d="M1000 60 L1060 90" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>
<g class="c1" opacity=".5"><ellipse cx="0" cy="300" rx="190" ry="22" fill="#3a4b86"/><ellipse cx="110" cy="283" rx="110" ry="16" fill="#3a4b86"/></g>
<g class="c2" opacity=".4"><ellipse cx="0" cy="190" rx="150" ry="16" fill="#4a5c9a"/><ellipse cx="80" cy="176" rx="90" ry="12" fill="#4a5c9a"/></g>
<path d="M-100 700 Q200 600 520 690 T1100 670 T1700 650 V900 H-100Z" fill="#0d1531"/>
<path d="M-100 780 Q300 710 700 790 T1700 760 V900 H-100Z" fill="#080d22"/>
<ellipse class="rf" cx="1150" cy="830" rx="150" ry="10" fill="#dfe8ff"/>
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
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A moonlit night with drifting clouds, twinkling stars and a shooting star" isInteractive />
  })
}
