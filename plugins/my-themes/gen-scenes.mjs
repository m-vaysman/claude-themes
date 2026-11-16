// Rebuilds hooks/scenes.ts from the previews, so the switcher always draws what the README shows.
// Run from the repository root: node plugins/my-themes/gen-scenes.mjs
import fs from 'fs'

const IDS = ['desert', 'festive', 'moon', 'ancient-japan', 'tsunami', 'starry-night']

const body = IDS.map(id => {
  const svg = fs.readFileSync(`previews/${id}-backdrop.svg`, 'utf8').replace(/\r\n/g, '\n')

  return `  ${JSON.stringify(id)}: ${JSON.stringify(svg)},\n`
}).join('')

fs.writeFileSync(
  'plugins/my-themes/hooks/scenes.ts',
  `// Generated from previews/*.svg by gen-scenes.mjs: the drawn scenes, one string each.\nexport const SCENES: Record<string, string> = {\n${body}}\n`,
)
console.log('scenes.ts written')
