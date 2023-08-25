import fs from 'fs'

fs.copyFileSync('package.json', 'dist/package.json')
fs.copyFileSync('readme.md', 'dist/readme.md')