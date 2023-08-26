export interface DictionaryBranch<T = string> extends Record<string, DictionaryBranch<T> | T> {}

export type DictionaryProps<TDictionary extends DictionaryBranch> = {
    keySeparator?: string,
    keySuffix?: string,
    dictionary: TDictionary
}

export type PassedDictionaryProps<TDictionary extends DictionaryBranch> = Required<DictionaryProps<TDictionary>>
