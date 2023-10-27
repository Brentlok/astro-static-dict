import { readFile, writeFile, mkdir } from 'fs/promises'
import { Node, TextNode, parse } from 'node-html-parser'
import { DictionaryBranch, DictionaryProps } from '../types/index.js'
import { getDictValue } from '../utils/getDictValue.js'

type Route = {
    distURL: URL
}

type AstroBuildProps = {
    dir: URL,
    routes: Array<Route>
}

type DictionariesByLanguage = Record<string, DictionaryBranch>

type IntegrationProps<TDictionary extends DictionaryBranch> = {
    dictionaries: DictionariesByLanguage
} & DictionaryProps<TDictionary>

export const astroStaticDict = <TDictionary extends DictionaryBranch>({
    dictionary,
    keySeparator = '@@@',
    keySuffix = '!!!',
    dictionaries
}: IntegrationProps<TDictionary>) => {
    return {
        name: 'astro-static-dict',
        hooks: {
            'astro:build:done': async ({ dir, routes }: AstroBuildProps) => {
                const parseDictionaries = async () => {
                    await mkdir(`${dir.pathname}dictionary`)

                    return Promise.all(Object.keys(dictionaries).map(async language => {
                        const dict = dictionaries[language]
                        const dictString = JSON.stringify(dict)
                        const dictPath = `${dir.pathname}dictionary/${language}.json`

                        await writeFile(dictPath, dictString)
                    }))
                }

                const parseNodes = (nodes: Array<Node>) => {
                    nodes.forEach(node => {
                        if (node instanceof TextNode) {
                            const matched = node.text.match(new RegExp(`[\\w|_|\/|\-|-|${keySeparator}]+${keySuffix}`, 'g'))

                            if (!matched) {
                                return
                            }

                            const dictValue = matched.reduce((acc, dictKey, index) => {
                                const value = getDictValue({
                                    dictionary,
                                    dictKey,
                                    keySeparator,
                                    keySuffix
                                })

                                const dataAttr = index === 0
                                    ? 'data-dict'
                                    : `data-dict-${index}`

                                node.parentNode.setAttribute(dataAttr, dictKey)

                                return acc.replace(dictKey, value)
                            }, node.text)

                            node.textContent = dictValue

                            return
                        }

                        if (node.childNodes.length === 0) {
                            return
                        }

                        parseNodes(Array.from(node.childNodes))
                    })
                }

                await Promise.all(routes.map(async ({ distURL: { pathname } }) => {
                    if (!pathname.endsWith('.html')) {
                        return
                    }

                    const file = await readFile(pathname, 'utf8')
                    const root = parse(file)
                    const body = root.querySelector('body')
    
                    if (!body) {
                        throw new Error('Oh goosh there is no body')
                    }
        
                    console.log('Applying dictionary keys to', pathname)
                    parseNodes(Array.from(body.childNodes))
                    await writeFile(pathname, root.toString())    
                }))

                await parseDictionaries()
            },
        }
    }
}
