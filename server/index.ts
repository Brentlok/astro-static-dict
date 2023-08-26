import { DictionaryBranch, DictionaryProps } from '../types/index.js'
import { dictionaryParser } from './parser.js'

type InitProps<TDictionary extends DictionaryBranch> = {
    isDev: boolean
} & DictionaryProps<TDictionary>

export const initDictionary = <TDictionary extends DictionaryBranch>({
    dictionary,
    keySeparator,
    keySuffix,
    isDev
}: InitProps<TDictionary>) => {
    // If we are in dev mode (SSR), we don't need to parse the dictionary
    if (isDev) {
        return dictionary
    }

    return Object.keys(dictionary).reduce((dict, key) => {
        return {
            ...dict,
            [key]: dictionaryParser({
                currentKey: key,
                branch: dictionary,
                keySeparator,
                keySuffix
            })
        }
    }, {} as TDictionary)
}
