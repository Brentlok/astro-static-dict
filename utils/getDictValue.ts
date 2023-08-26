import { DictionaryBranch, PassedDictionaryProps } from '../types/index.js';

type GetDictValueProps<TDictionary extends DictionaryBranch> = {
    dictKey: string
} & PassedDictionaryProps<TDictionary>

export const getDictValue = <TDictionary extends DictionaryBranch>({
    dictionary,
    keySeparator,
    keySuffix,
    dictKey
}: GetDictValueProps<TDictionary>) => {
    const value = dictKey
        .replace(keySuffix, '')
        .split(keySeparator)
        .reduce((acc, key) => {
            // @ts-ignore
            return acc[key]
        }, dictionary as TDictionary | string)

    if (typeof value !== 'string') {
        throw new Error('Wrong key was passed')
    }

    return value
}
