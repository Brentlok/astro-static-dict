import { DictionaryBranch } from '../types/index.js'

type BuildParserProps = {
    previousKey?: string,
    currentKey: string,
    keySeparator?: string,
    keySuffix?: string,
    branch: DictionaryBranch
}

export const dictionaryParser = ({
    previousKey = '',
    keySeparator = '@@@',
    keySuffix = '!!!',
    currentKey,
    branch
}: BuildParserProps): DictionaryBranch | string => {
    const value = branch[currentKey]
    const newKey = previousKey === '' ? currentKey : `${previousKey}${keySeparator}${currentKey}`

    if (typeof value === 'string') {
        return `${newKey}${keySuffix}`
    }

    return Object.keys(value).reduce((dict, key) => {
        return {
            ...dict,
            [key]: dictionaryParser({
                previousKey: newKey,
                currentKey: key,
                branch: value,
                keySeparator,
                keySuffix
            })
        }
    }, {} as DictionaryBranch)
}
