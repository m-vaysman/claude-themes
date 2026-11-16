import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

// Cream paper and Prussian blue ink, the two colours of the print.
const { theme } = makeColors({
  label: 'Great wave',
  only: 'light',
  roles: { accent: '#1f5a99', danger: '#b3392f', success: '#3f7d4e', warning: '#a86f14', pro: '#6d4f94' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#eadfc6',
        'surface-1': '#f1e8d3',
        'surface-2': '#f8f2e3',
        'text-primary': '#14243a',
        'text-secondary': '#34465d',
        'text-muted': '#55647a',
      },
    },
    git: { added: '#1f5c33', removed: '#8f2b24', modified: '#6e4a0c', merged: '#4a3278', closed: '#8f2b24', conflicting: '#6e4a0c', draft: '#414d5e' },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'tsunami', glass: { blur: 14, tint: '#f3ead4', opacity: 0.55 } },
  overrideColorScheme: 'light',
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
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A great wave in the style of a Japanese woodblock print, with spray drifting off its crest" isInteractive />
  })
}
