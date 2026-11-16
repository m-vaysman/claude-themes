import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

const { theme } = makeColors({
  label: 'Festive night',
  only: 'dark',
  roles: { accent: '#e5574f', danger: '#e0534a', success: '#5fb36a', warning: '#e8b043', pro: '#a98bd6' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0d1a24',
        'surface-1': '#13232f',
        'surface-2': '#192c3a',
        'surface-3': '#192c3a',
        'text-primary': '#f4f1ea',
        'text-secondary': '#cfd8dc',
        'text-muted': '#a9b8c0',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'festive' }, overrideColorScheme: 'dark' }

// Deterministic pseudo-random so the scene is stable between draws.
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const flakes = Array.from({ length: 60 }, (_, i) => {
  const x = Math.round(rnd(i) * 1600)
  const r = (1 + rnd(i + 99) * 2.6).toFixed(1)
  const dur = (9 + rnd(i + 7) * 12).toFixed(1)
  const delay = (-rnd(i + 31) * 20).toFixed(1)
  const sway = i % 2 === 0 ? 'a' : 'b'
  return `<circle class="f ${sway}" cx="${x}" cy="-10" r="${r}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`
}).join('')

const COLORS = ['#ff5a4f', '#ffd35a', '#5fd38a', '#6cb8ff']
const lights = Array.from({ length: 26 }, (_, i) => {
  const x = 30 + i * 60.8
  const y = 34 + Math.sin((i / 26) * Math.PI * 6) * 14
  const c = COLORS[i % 4]
  const d = (rnd(i + 5) * 3).toFixed(2)
  return `<circle class="l" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="6" fill="${c}" style="animation-delay:-${d}s"/><circle class="l" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="14" fill="${c}" opacity=".18" style="animation-delay:-${d}s"/>`
}).join('')

const tree = (x: number, s: number, o: number) =>
  `<g transform="translate(${x} 900) scale(${s})" opacity="${o}"><path d="M0 -330 L70 -190 L35 -190 L110 -70 L55 -70 L140 40 L-140 40 L-55 -70 L-110 -70 L-35 -190 L-70 -190 Z" fill="#0a2a22"/><circle class="l" cx="0" cy="-330" r="9" fill="#ffd35a"/><circle class="l" cx="-30" cy="-150" r="6" fill="#ff5a4f" style="animation-delay:-1s"/><circle class="l" cx="35" cy="-100" r="6" fill="#6cb8ff" style="animation-delay:-2s"/><circle class="l" cx="-60" cy="-20" r="6" fill="#ffd35a" style="animation-delay:-.5s"/><circle class="l" cx="70" cy="10" r="6" fill="#ff5a4f" style="animation-delay:-1.5s"/></g>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.f{fill:#fff;opacity:.85;animation:fall linear infinite}
.f.a{animation-name:fall-a}.f.b{animation-name:fall-b}
@keyframes fall-a{0%{transform:translate(0,0)}50%{transform:translate(30px,500px)}100%{transform:translate(-10px,1000px)}}
@keyframes fall-b{0%{transform:translate(0,0)}50%{transform:translate(-30px,500px)}100%{transform:translate(10px,1000px)}}
.l{animation:tw 3s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.25}}
.st{animation:tw 4s ease-in-out infinite;fill:#fff}
</style>
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1420"/><stop offset=".7" stop-color="#14303b"/><stop offset="1" stop-color="#1d3f45"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#g)"/>
<circle class="st" cx="200" cy="140" r="1.6"/><circle class="st" cx="620" cy="110" r="1.4" style="animation-delay:-1s"/><circle class="st" cx="1010" cy="150" r="1.8" style="animation-delay:-2s"/><circle class="st" cx="1420" cy="120" r="1.5" style="animation-delay:-3s"/><circle class="st" cx="1250" cy="230" r="1.3" style="animation-delay:-1.5s"/>
<path d="M0 820 Q400 770 800 810 T1600 800 V900 H0Z" fill="#e8f1f5" opacity=".9"/>
${tree(120, 1, 1)}${tree(300, 0.6, 0.8)}${tree(1480, 1.05, 1)}${tree(1310, 0.65, 0.8)}
<path d="M0 30 Q400 70 800 40 T1600 34" stroke="#2c3a40" stroke-width="3" fill="none"/>
${lights}
${flakes}
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

    return <Svg source={SCENE} alt="Snowfall at night with twinkling holiday lights and evergreens" isInteractive />
  })
}
