import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENES } from './scenes'

type Roles = { accent: string; danger: string; success: string; warning: string; pro: string }
type Glass = { blur: number; tint: string; opacity: number }
type Def = {
  id: string
  title: string
  mode: 'light' | 'dark'
  roles: Roles
  anchors: Record<string, string>
  glass?: Glass
}

const DEFS: readonly Def[] = [
  { id: 'desert', title: 'Desert', mode: 'dark', roles: { accent: '#e8895a', danger: '#e0594a', success: '#8fb36a', warning: '#e8b043', pro: '#b08bd0' }, anchors: { 'surface-0': '#1f1612', 'surface-1': '#2a1d17', 'surface-2': '#34251d', 'surface-3': '#34251d', 'text-primary': '#f6ebdc', 'text-secondary': '#dccbb6', 'text-muted': '#b9a690' } },
  { id: 'festive', title: 'Festive', mode: 'dark', roles: { accent: '#e5574f', danger: '#e0534a', success: '#5fb36a', warning: '#e8b043', pro: '#a98bd6' }, anchors: { 'surface-0': '#0d1a24', 'surface-1': '#13232f', 'surface-2': '#192c3a', 'surface-3': '#192c3a', 'text-primary': '#f4f1ea', 'text-secondary': '#cfd8dc', 'text-muted': '#a9b8c0' } },
  { id: 'moon', title: 'Moon', mode: 'dark', roles: { accent: '#8fb4ff', danger: '#e0646a', success: '#6fc2a0', warning: '#e0c070', pro: '#b9a0f0' }, anchors: { 'surface-0': '#0b1020', 'surface-1': '#111833', 'surface-2': '#18214a', 'surface-3': '#18214a', 'text-primary': '#eef2fb', 'text-secondary': '#c9d2e8', 'text-muted': '#a3aecb' } },
  { id: 'ancient-japan', title: 'Ancient Japan', mode: 'dark', roles: { accent: '#e2543f', danger: '#e0594a', success: '#8fb08a', warning: '#e0b25a', pro: '#b595c9' }, anchors: { 'surface-0': '#10151f', 'surface-1': '#171e2c', 'surface-2': '#1f283a', 'surface-3': '#1f283a', 'text-primary': '#f3ede0', 'text-secondary': '#d6cfbe', 'text-muted': '#aea896' } },
  { id: 'tsunami', title: 'Tsunami', mode: 'light', roles: { accent: '#1f5a99', danger: '#b3392f', success: '#3f7d4e', warning: '#a86f14', pro: '#6d4f94' }, anchors: { 'surface-0': '#eadfc6', 'surface-1': '#f1e8d3', 'surface-2': '#f8f2e3', 'text-primary': '#14243a', 'text-secondary': '#34465d', 'text-muted': '#55647a' }, glass: { blur: 14, tint: '#f3ead4', opacity: 0.55 } },
  { id: 'starry-night', title: 'Starry Night', mode: 'dark', roles: { accent: '#f0c044', danger: '#e0594a', success: '#6fb58a', warning: '#e8843a', pro: '#9a8be0' }, anchors: { 'surface-0': '#0c1430', 'surface-1': '#121c40', 'surface-2': '#18244f', 'surface-3': '#18244f', 'text-primary': '#f1ecd6', 'text-secondary': '#cfcdb8', 'text-muted': '#a6aac0' }, glass: { blur: 14, tint: '#0c1430', opacity: 0.55 } },
]

const GIT_LIGHT = { added: '#1f5c33', removed: '#8f2b24', modified: '#6e4a0c', merged: '#4a3278', closed: '#8f2b24', conflicting: '#6e4a0c', draft: '#414d5e' }

const look = (d: Def): ThemeSetArgs => {
  const gray = { anchors: d.anchors }
  const { theme } = makeColors({
    label: d.title,
    only: d.mode,
    roles: d.roles,
    ...(d.mode === 'light' ? { light: { gray, git: GIT_LIGHT } } : { dark: { gray } }),
  })

  return { colors: theme, backdrop: { scene: d.id, ...(d.glass !== undefined && { glass: d.glass }) }, overrideColorScheme: d.mode }
}

// "Tsunami", "tsunami-backdrop" and "starry night" all find the same theme.
const find = (word: string) => {
  const key = word.trim().toLowerCase().replace(/-backdrop$/, '').replace(/\s+/g, '-')

  return key === '' ? undefined : (DEFS.find(d => d.id === key) ?? DEFS.find(d => d.id.startsWith(key)))
}

const KEY = 'theme'
const NAMES = DEFS.map(d => d.id).join(', ')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'my-theme',
      description: 'Pick one of your animated themes by name',
      argumentHint: '[list | off | theme name]',
    })
    const saved = await $.store.get(KEY)
    const def = typeof saved === 'string' ? find(saved) : undefined

    if (def !== undefined) {
      await $.theme.set(look(def))
    }

    return next(e)
  })

  // Typing "/my-theme " lists the theme names right in the prompt box.
  on('prompt.autocomplete', async ($, e, next) => {
    const before = e.text.slice(0, e.start).trim()
    const found = await next(e)

    if (before !== '/my-theme') {
      return found
    }

    const word = e.token.toLowerCase()
    const rows = [
      ...DEFS.map(d => ({ text: d.id, label: d.id, description: `${d.title}, ${d.mode} window` })),
      { text: 'list', label: 'list', description: 'Show the theme names' },
      { text: 'off', label: 'off', description: 'Clear the theme' },
    ].filter(row => row.text.startsWith(word))

    return { suggestions: [...found.suggestions, ...rows] }
  })

  on('command.run', { command: 'my-theme' }, async ($, e) => {
    const arg = e.args.trim()

    if (arg === '' || arg === 'list') {
      const saved = await $.store.get(KEY)
      const note = typeof saved === 'string' ? `\nSaved: ${saved}.` : ''

      return { text: `Themes: ${NAMES}.\nApply one with /my-theme <name>. /my-theme off clears it.${note}` }
    }

    if (arg === 'off') {
      await $.store.delete(KEY)
      await $.theme.clear()

      return { text: 'Theme cleared.' }
    }

    const def = find(arg)

    if (def === undefined) {
      return { text: `No theme named "${arg}". Themes: ${NAMES}.` }
    }

    const set = await $.theme.set(look(def))
    await $.store.set(KEY, def.id)

    return {
      text: set.isDrawn
        ? `${def.title} applied, and saved for new sessions.`
        : `${def.title} saved, but this window may not draw themes (${set.reason}).`,
    }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const source = SCENES[String(e.props.scene)]

    if (source === undefined) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={source} alt="An animated theme backdrop" isInteractive />
  })
}
