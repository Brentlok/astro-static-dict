import { DictionaryBranch } from "./index.ts"

export declare global {
    type ChangeLanguageEvent = Event & {
        detail: string
    }

    interface WindowEventMap extends WindowEventMap {
        changeLanguage: ChangeLanguageEvent
    }

    interface Window {
        changeLanguage(newLanguage: string): void,
        selectedLanguage: string,
        cachedDictionaries: Partial<Record<string, DictionaryBranch>>
    }
}