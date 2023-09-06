import { DictionaryBranch } from '../types/index.js'
import { getDictValue } from '../utils/getDictValue.js'

type ChangeLanguageOnPageProps = {
    newDict: DictionaryBranch,
    keySeparator: string,
    keySuffix: string
}

const changeLanguageOnPage = ({
    newDict,
    keySeparator,
    keySuffix
}: ChangeLanguageOnPageProps) => {
    const oldDict = window.cachedDictionaries[window.selectedLanguage]

    if (!oldDict) {
        throw new Error('Old dictionary not found')
    }

    const replaceText = (element: Element, index: number) => {
        const dataAttr = index === 0
            ? 'data-dict'
            : `data-dict-${index}`
        const dictKey = element.getAttribute(dataAttr)

        if (!dictKey) {
            return
        }

        const oldDictValue = getDictValue({
            dictionary: oldDict,
            dictKey,
            keySeparator,
            keySuffix
        })
        const newDictValue = getDictValue({
            dictionary: newDict,
            dictKey,
            keySeparator,
            keySuffix
        })

        if (element.textContent) {
            element.textContent = element.textContent.replace(oldDictValue, newDictValue)

            replaceText(element, index + 1)
        }
    }

    document.querySelectorAll('[data-dict]').forEach(element => replaceText(element, 0))
}

type WatchChangeLanguageProps = {
    cachedDictionaries: Record<string, DictionaryBranch>,
    defaultLanguage: string,
    keySeparator?: string,
    keySuffix?: string
}

export const watchLanguageChange = ({
    cachedDictionaries,
    defaultLanguage,
    keySeparator = '@@@',
    keySuffix = '!!!'
}: WatchChangeLanguageProps) => {
    window.cachedDictionaries = cachedDictionaries
    window.selectedLanguage = defaultLanguage

    const getDictionary = async (language: string) => {
        if (language in window.cachedDictionaries) {
            return window.cachedDictionaries[language]
        }

        const dictionaryResponse = await fetch(`/dictionary/${language}.json`)
        const dictionary = await dictionaryResponse.json()

        window.cachedDictionaries[language] = dictionary

        return dictionary
    }

    const handler = async (event: ChangeLanguageEvent) => {
        try {
            changeLanguageOnPage({
                newDict: await getDictionary(event.detail),
                keySeparator,
                keySuffix
            })
            window.selectedLanguage = event.detail
        } catch (error) {
            console.error(`Dictionary for language ${event.detail} not found`)
        }
    }

    window.changeLanguage = (newLanguage: string) => window.dispatchEvent(new CustomEvent('changeLanguage', { detail: newLanguage }))
    window.addEventListener('changeLanguage', handler)
}
