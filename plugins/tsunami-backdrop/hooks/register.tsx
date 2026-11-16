import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Prussian blue and cream, the palette of Japanese woodblock wave prints.
const { theme } = makeColors({
  label: 'Great wave',
  only: 'dark',
  roles: { accent: '#e0674f', danger: '#e0594a', success: '#7fb59a', warning: '#e0b25a', pro: '#a995d0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1828',
        'surface-1': '#102238',
        'surface-2': '#172e4b',
        'surface-3': '#172e4b',
        'text-primary': '#f4eedc',
        'text-secondary': '#d3cdb9',
        'text-muted': '#a9b0b8',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'tsunami' }, overrideColorScheme: 'dark' }

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// Spray is the only thing that moves: droplets thrown off the crest and its claws.
const spray = Array.from({ length: 46 }, (_, i) => {
  const x = Math.round(330 + rnd(i) * 420)
  const y = Math.round(90 + rnd(i + 40) * 230)
  const r = (1.6 + rnd(i + 9) * 4.2).toFixed(1)
  const dur = (2.8 + rnd(i + 21) * 3.4).toFixed(1)
  const delay = (-rnd(i + 5) * 6).toFixed(1)
  return `<circle class="sp ${i % 2 ? 'a' : 'b'}" cx="${x}" cy="${y}" r="${r}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`
}).join('')

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.sp{fill:#f4eedc;opacity:0;animation:spray ease-out infinite}
.sp.a{animation-name:spa}.sp.b{animation-name:spb}
@keyframes spa{0%{opacity:0;transform:translate(0,0)}15%{opacity:.9}100%{opacity:0;transform:translate(70px,-90px)}}
@keyframes spb{0%{opacity:0;transform:translate(0,0)}15%{opacity:.8}100%{opacity:0;transform:translate(40px,-60px)}}
</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2c45"/><stop offset=".7" stop-color="#4a5a66"/><stop offset="1" stop-color="#8a8a80"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<path d="M1000 640 L1230 420 Q1270 395 1310 420 L1540 640Z" fill="#26364d"/>
<path d="M1230 420 Q1270 395 1310 420 L1325 436 Q1290 428 1272 450 Q1255 428 1218 436Z" fill="#eee8d6"/>
<path d="M-100 900 V610 C-10 570 70 430 150 310 C230 190 370 105 520 125 C610 137 668 195 656 262 C632 232 574 216 526 246 C478 278 462 344 512 424 C570 520 710 580 920 604 C1120 626 1320 646 1700 626 V900Z" fill="#12345a"/>
<path d="M-100 900 V700 C200 650 420 690 700 690 C1000 690 1300 700 1700 690 V900Z" fill="#0c2442"/>
<path d="M150 310 C230 190 370 105 520 125 C610 137 668 195 656 262 C632 232 574 216 526 246 C500 262 486 290 486 320 C440 250 360 230 290 270 C230 305 190 350 150 410Z" fill="#1c4a7a"/>
<path d="M520 125 C610 137 668 195 656 262 C640 240 612 228 586 226 C612 190 590 160 520 125Z" fill="#f4eedc"/>
<g fill="#f4eedc"><path d="M366 112 L346 62 L392 104Z"/><path d="M430 100 L420 40 L458 96Z"/><path d="M494 108 L494 46 L528 112Z"/><path d="M556 126 L572 72 L596 140Z"/><path d="M612 160 L650 116 L640 186Z"/><path d="M670 214 L716 188 L690 250Z"/><path d="M300 150 L268 108 L322 140Z"/></g>
<path d="M-100 700 C200 690 420 706 700 700" stroke="#5f8fb8" stroke-width="3" fill="none" opacity=".5"/>
<path d="M860 640 L1020 640 L1000 662 L880 662Z" fill="#c9a36a"/><path d="M938 640 L938 580 L970 640Z" fill="#eee8d6"/>
${spray}
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

    return <Svg source={SCENE} alt="A great curling wave in a Japanese woodblock print style, with spray drifting off the crest" isInteractive />
  })
}
