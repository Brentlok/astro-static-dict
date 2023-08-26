export declare global {
    type ChangeLanguageEvent = Event & {
        detail: string
    }

    interface WindowEventMap extends WindowEventMap {
        changeLanguage: ChangeLanguageEvent
    }

    interface Window {
        changeLanguage(newLanguage: string): void
    }
}