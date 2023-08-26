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
    document.querySelectorAll('[data-dict]').forEach(element => {
        const dictKey = element.getAttribute('data-dict')

        if (!dictKey) {
            return
        }

        const dictValue = getDictValue({
            dictionary: newDict,
            dictKey,
            keySeparator,
            keySuffix
        })

        element.textContent = dictValue
    })
}

type WatchChangeLanguageProps = {
    keySeparator?: string,
    keySuffix?: string
}

export const watchLanguageChange = (props?: WatchChangeLanguageProps) => {
    const { keySeparator = '@@@', keySuffix = '!!!' } = props || {}

    const handler = async (event: ChangeLanguageEvent) => {
        try {
            const res = await fetch(`/dictionary/${event.detail}.json`)

            changeLanguageOnPage({
                newDict: await res.json(),
                keySeparator,
                keySuffix
            })
        } catch (error) {
            console.error(`Dictionary for language ${event.detail} not found`)
        }
    }

    window.changeLanguage = (newLanguage: string) => window.dispatchEvent(new CustomEvent('changeLanguage', { detail: newLanguage }))
    window.addEventListener('changeLanguage', handler)
}
