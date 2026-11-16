import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

// Night blues with the yellow of the stars.
const { theme } = makeColors({
  label: 'Starry night',
  only: 'dark',
  roles: { accent: '#f0c044', danger: '#e0594a', success: '#6fb58a', warning: '#e8843a', pro: '#9a8be0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0c1430',
        'surface-1': '#121c40',
        'surface-2': '#18244f',
        'surface-3': '#18244f',
        'text-primary': '#f1ecd6',
        'text-secondary': '#cfcdb8',
        'text-muted': '#a6aac0',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'starry-night', glass: { blur: 14, tint: '#0c1430', opacity: 0.55 } },
  overrideColorScheme: 'dark',
}

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
    if (String(e.props.scene) !== 'starry-night') {
      return next(e)
    }

    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A swirling starry night sky over a village and a cypress, in the style of the 1889 painting" isInteractive />
  })
}
