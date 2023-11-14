# astro-static-dict

<p align="center">
    <img src="https://raw.githubusercontent.com/Brentlok/astro-static-dict/main/assets/logo.svg" width="400"/>
</p>

## <a href='https://www.typescriptlang.org/'><img src='https://badges.frapsoft.com/typescript/code/typescript.png?v=101' alt='typescript' height=20/></a> <a href='http://opensource.org/licenses/MIT'><img src='http://img.shields.io/badge/license-MIT-brightgreen.svg' alt='MIT' /></a> <a href="https://badge.fury.io/js/astro-static-dict"><img src="https://badge.fury.io/js/astro-static-dict.svg" alt="npm version" height="18"></a> <a href="https://www.npmjs.com/package/astro-static-dict"><img src="https://img.shields.io/npm/dm/astro-static-dict" alt="npm downloads" height="20"></a>

### Installation

```
npm install astro-static-dict
yarn add astro-static-dict
pnpm add astro-static-dict
bun install astro-static-dict
```
### [Live demo](https://codesandbox.io/p/sandbox/dreamy-murdock-mg8qf8?file=/src/pages/index.astro:1,1)

### Motivation
We dont really want to use another frameworks (react, svelte, solid...) just to change language on client side, and according to [Astro documentation](https://docs.astro.build/en/recipes/i18n) we should be building separated HTML for each language. This is fine, but it can feel pretty slow and page refresh is not the best for user experience.

### How it works
When building your site astro-static-dict integration parses all built HTML files by adding data-dict attribute based on language key you passed, it also converts all your dictionary objects to JSON.
Later - on client browser, when language is changed it downloads new JSON dictionary, and replaces every node with data-dict attribute with new text.

## DictionaryBranch interface

```ts
interface DictionaryBranch<T = string> extends Record<string, DictionaryBranch<T> | T> {}
```

## Server side

```astro
---
import { initDictionary } from 'astro-static-dict/server'
import { enUs } from 'lib/locale'
import Layout from 'lib/layouts/Layout.astro'

const T = initDictionary({
    dictionary: enUs,
    isDev: import.meta.env.DEV
})
---

<Layout>
    <h1>
        {T.hello}
    </h1>
</Layout>
```

You can initialize new dictionary with ``initDictionary`` method imported from ``astro-static-dict/server``. You can initalize new one per component or have some place where you initalize it and export into other components, pages etc,

#### initDictionary config

| Property        | Type                       | Description                                                                                                                               |
|-----------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| dictionary      | DictionaryBranch           | Default dictionary used for development, it is also used for typing your created dictionary.                                              |
| isDev           | boolean                    | Always pass import.meta.env.DEV into it                                                                                                   |
| keySeparator    | string                     | Default: `@@@` <br> Used to separate dictionary keys in build process                                                                     |
| keySuffix       | string                     | Default: `!!!` <br> Used to end data-dict attribute in build process                                                                      |

## Integration

```js
import { defineConfig } from 'astro/config'
import { astroStaticDict } from 'astro-static-dict/integration'
import { enUs, plPl } from 'lib/locale'

export default defineConfig({
    integrations: [
        astroStaticDict({
            dictionary: enUs,
            dictionaries: {
                enUs,
                plPl
            }
        })
    ]
})
```

#### astroStaticDict integration config

| Property        | Type                             | Description                                                                                                                               |
|-----------------|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| dictionary      | DictionaryBranch                 | Default language dictionary for build process                                                                                             |
| dictionaries    | Record<string, DictionaryBranch> | All your dictionaries that will be transformed into JSON files                                                                            |
| keySeparator    | string                           | Default: `!!!` <br> Must be the same as initDictionary's keySeparator                                                                     |
| keySuffix       | string                           | Default: `!!!` <br> Must be the same as initDictionary's keySuffix                                                                        |

## Client

```ts
import { watchLanguageChange } from 'astro-static-dict/client'
import { enUs } from 'lib/locale'

watchLanguageChange({
    cachedDictionaries: {
        enUs
    },
    defaultLanguage: 'enUs'
})
```

It listens for changeLanguage event - when this event is trigerred it downloads dictionary in JSON format and replaces every text node on website.

#### watchLanguageChange config

| Property           | Type                               | Description                                                                                                                                |
|--------------------|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| cachedDictionaries | Record<string, DictionaryBranch>   | Dictionaries that will be injected into window.cachedDictionaries, you must include dictionary used in build process but more is up to you |
| defaultLanguage    | string                             | <br> Name of default language used on a page. Must be the same as dictionary used in build process                                         |
| keySeparator       | string                             | Default: `@@@` <br> Must be the same as initDictionary's keySeparator                                                                      |
| keySuffix          | string                             | Default: `!!!` <br> Must be the same as initDictionary's keySuffix                                                                         |

#### Trigger language change

```ts
interface Window {
    changeLanguage(newLanguage: string): void
}
// or
window.dispatchEvent(new CustomEvent('changeLanguage', { detail: newLanguage }))
```

### Window modified properties

```ts
interface Window {
    changeLanguage(newLanguage: string): void,
    selectedLanguage: string,
    cachedDictionaries: Partial<Record<string, DictionaryBranch>>
}
```
