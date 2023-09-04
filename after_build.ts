import fs from 'fs'

const copy = {
    'publish.json': 'package.json',
    'readme.md': 'readme.md',
    'LICENSE': 'LICENSE',
}

Object.keys(copy).forEach((src) => {
    fs.copyFileSync(src, `dist/${copy[src as keyof typeof copy]}`)
})