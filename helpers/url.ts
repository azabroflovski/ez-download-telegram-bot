/**
 * Detect platform patterns
 */
export const urlMatchers = [
    {
        name: 'instagram',
        // eslint-disable-next-line
        regexp: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^\/]+)/,
    },
    {
        name: 'tiktok',
        // eslint-disable-next-line
        regexp: /^.*https:\/\/?(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/
    },
    {
        name: 'youtube',
        // eslint-disable-next-line
        regexp: /(?:https?:\/\/)?(?:www\.)?youtube|youtu\.com|.be\/(?:c\/|channel\/|user\/)?([^\/]+)/,
    }
]


/**
 * Check string for URL
 * @param url {string}
 */
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
 * @param url {string}
 */
export function detectUrlPlatform(url: string): Platform {
    const platform = urlMatchers.find(matcher => {
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
