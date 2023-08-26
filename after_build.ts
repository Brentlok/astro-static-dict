import fs from 'fs'

fs.copyFileSync('publish.json', 'dist/package.json')
fs.copyFileSync('readme.md', 'dist/readme.md')
