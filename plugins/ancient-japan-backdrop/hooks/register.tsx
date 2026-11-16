import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Indigo-dyed night with vermilion lacquer accents.
const { theme } = makeColors({
  label: 'Ancient Japan',
  only: 'dark',
  roles: { accent: '#e2543f', danger: '#e0594a', success: '#8fb08a', warning: '#e0b25a', pro: '#b595c9' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#10151f',
        'surface-1': '#171e2c',
        'surface-2': '#1f283a',
        'surface-3': '#1f283a',
        'text-primary': '#f3ede0',
        'text-secondary': '#d6cfbe',
        'text-muted': '#aea896',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'ancient-japan' }, overrideColorScheme: 'dark' }

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const petals = Array.from({ length: 34 }, (_, i) => {
  const x = Math.round(rnd(i) * 1600)
  const dur = (10 + rnd(i + 7) * 12).toFixed(1)
  const delay = (-rnd(i + 31) * 22).toFixed(1)
  const s = (0.6 + rnd(i + 19) * 0.9).toFixed(2)
  return `<g transform="translate(${x} -20)"><g class="p ${i % 2 ? 'a' : 'b'}" style="animation-duration:${dur}s;animation-delay:${delay}s"><ellipse rx="${(7 * Number(s)).toFixed(1)}" ry="${(4 * Number(s)).toFixed(1)}" fill="#f4b8c4" opacity=".85"/></g></g>`
}).join('')

const tier = (i: number) => {
  const y = -i * 40
  const w = 74 - i * 10
  return `<rect x="${-w * 0.62}" y="${y - 24}" width="${w * 1.24}" height="24"/><path d="M${-w - 14} ${y - 24} Q0 ${y - 46} ${w + 14} ${y - 24} L${w + 4} ${y - 16} H${-w - 4}Z"/>`
}

const pagoda = `<g transform="translate(1130 650) scale(1.5)"><g fill="#0e1322"><rect x="-60" y="0" width="120" height="8"/>${[0, 1, 2, 3, 4].map(tier).join('')}<rect x="-2" y="-232" width="4" height="46"/><circle cx="0" cy="-196" r="3"/></g><g class="lamp"><circle cx="-12" cy="-12" r="2.6" fill="#ffd9a0"/><circle cx="12" cy="-12" r="2.6" fill="#ffd9a0"/><circle cx="0" cy="-52" r="2.4" fill="#ffd9a0"/><circle cx="0" cy="-92" r="2.2" fill="#ffd9a0"/></g></g>`

const samurai = `<g transform="translate(720 742)" fill="#05080f"><path d="M-30 -118 L0 -146 L30 -118 Q0 -108 -30 -118Z"/><circle cx="0" cy="-104" r="9"/><path d="M-20 -94 Q0 -84 20 -94 L30 -30 L-30 -30Z"/><path d="M-34 -30 H34 L44 0 H-44Z"/><rect x="26" y="-70" width="46" height="4" rx="2" transform="rotate(-24 26 -70)"/><g class="flag"><rect x="40" y="-190" width="3" height="170"/><path d="M43 -190 H92 V-130 H43Z" fill="#c9402f"/></g></g>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.p{animation:fall linear infinite}
.p.a{animation-name:fa}.p.b{animation-name:fb}
@keyframes fa{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(60px,520px) rotate(180deg)}100%{transform:translate(-20px,1040px) rotate(360deg)}}
@keyframes fb{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(-60px,520px) rotate(-180deg)}100%{transform:translate(20px,1040px) rotate(-360deg)}}
.m1{animation:mist 50s ease-in-out infinite alternate}
.m2{animation:mist 80s ease-in-out infinite alternate-reverse}
@keyframes mist{from{transform:translateX(-80px)}to{transform:translateX(80px)}}
.sun{animation:breathe 9s ease-in-out infinite;transform-origin:1180px 300px}
@keyframes breathe{0%,100%{opacity:.85}50%{opacity:.6}}
.flag{animation:wave 4s ease-in-out infinite;transform-origin:40px -20px}
@keyframes wave{0%,100%{transform:skewY(0)}50%{transform:skewY(3deg)}}
.lamp{animation:flick 3s ease-in-out infinite}
@keyframes flick{0%,100%{opacity:1}50%{opacity:.55}}
</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1426"/><stop offset=".5" stop-color="#2b3556"/><stop offset=".8" stop-color="#b86a5c"/><stop offset="1" stop-color="#e8b27a"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<circle class="sun" cx="1180" cy="300" r="95" fill="#f3d9b0"/>
<path d="M300 640 L560 330 Q600 290 640 330 L900 640Z" fill="#1d2640"/>
<path d="M560 330 Q600 290 640 330 L660 358 Q620 346 600 372 Q580 346 540 358Z" fill="#eae4d6" opacity=".9"/>
<path d="M-100 650 Q150 560 400 640 T900 630 T1700 620 V900 H-100Z" fill="#161d33"/>
<g class="m1" opacity=".4"><ellipse cx="500" cy="640" rx="420" ry="26" fill="#cbbfae"/><ellipse cx="1250" cy="660" rx="360" ry="22" fill="#cbbfae"/></g>
${pagoda}
<path d="M-100 740 Q300 680 700 750 T1700 720 V900 H-100Z" fill="#0b101d"/>
<g class="m2" opacity=".3"><ellipse cx="900" cy="745" rx="520" ry="24" fill="#cbbfae"/></g>
<g fill="#c9402f"><rect x="212" y="560" width="14" height="190"/><rect x="354" y="560" width="14" height="190"/><path d="M180 556 Q290 540 400 556 L396 574 Q290 560 184 574Z"/><rect x="214" y="596" width="152" height="12"/></g>
<g stroke="#0b101d" stroke-width="22" fill="none" stroke-linecap="round"><path d="M1480 900 Q1470 780 1500 700 Q1520 640 1470 600"/></g>
<g fill="#f4b8c4" opacity=".9"><circle cx="1470" cy="596" r="16"/><circle cx="1448" cy="618" r="13"/><circle cx="1494" cy="612" r="14"/><circle cx="1470" cy="574" r="11"/></g>
${samurai}
${petals}
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

    return <Svg source={SCENE} alt="Ancient Japan at dawn: Mount Fuji, a pagoda, a samurai, a torii gate, mist and falling cherry petals" isInteractive />
  })
}
