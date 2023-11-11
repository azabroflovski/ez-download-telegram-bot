export const urlMatchers = [
    {
        name: 'Instagram',
        regexp: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^\/]+)/,
    },
    {
        name: 'TikTok',
        regexp: /^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/
    },
    {
        name: 'YouTube',
        regexp: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/)?([^\/]+)/,
    }
]


export function isUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export function detectUrlPlatform(url: string) {
    const platform = urlMatchers.find(matcher => {
        console.log(url, matcher.regexp.test(url.trim()))
        return matcher.regexp.test(url.trim())
    })

    if (platform) {
        return {
            name: platform.name,
            url,
        }

    }

    return {
        name: 'unknown',
        url: url,
    }
}
