# Astro static dict
Astro static dict is a library for lightweight client side language change for [Astro](https://astro.build)

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
| dictionary      | DictionaryBranch           | Default dictionary used for development and build process, it is also used for typing your created dictionary.                            |
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
| dictionaries    | Record<string, DictionaryBranch> | All your dictionaries that will be transformed into JSON files                                                                            |
| keySeparator    | string                           | Default: `!!!` <br> Must be the same as initDictionary's keySeparator                                                                     |
| keySuffix       | string                           | Default: `!!!` <br> Must be the same as initDictionary's keySuffix                                                                        |

## Client

```astro
<script>
    import { watchLanguageChange } from 'astro-static-dict/client'

    watchLanguageChange()
</script>
```

It listens for changeLanguage event - when this event is trigerred it downloads dictionary in JSON format and replaces every text node on website.

#### watchLanguageChange config (optional)

| Property        | Type                       | Description                                                                                                                               |
|-----------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| keySeparator    | string                     | Default: `@@@` <br> Must be the same as initDictionary's keySeparator                                                                     |
| keySuffix       | string                     | Default: `!!!` <br> Must be the same as initDictionary's keySuffix                                                                        |

#### Trigger language change

```ts
interface Window {
    changeLanguage(newLanguage: string): void
}
// or
window.dispatchEvent(new CustomEvent('changeLanguage', { detail: newLanguage }))
```