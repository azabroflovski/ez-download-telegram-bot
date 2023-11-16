/**
 *
 */
export const urlMatchers = [
    {
        name: 'instagram',
        regexp: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^\/]+)/,
    },
    {
        name: 'tiktok',
        regexp: /^.*https:\/\/?(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/
    },
    {
        name: 'youtube',
        regexp: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/)?([^\/]+)/,
    }
]


export function isUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

interface Platform {
    name: string | 'unknown'
    url: URL
}

/**
 * Detect platform by passed url
 * @param url
 */
export function detectUrlPlatform(url: string): Platform {
    const platform = urlMatchers.find(matcher => {
        console.log(url, matcher.regexp.test(url.trim()))
        return matcher.regexp.test(url.trim())
    })

    if (platform) {
        return {
            name: platform.name,
            url: new URL(url),
        }

    }

    return {
        name: 'unknown',
        url: new URL(url),
    }
}
