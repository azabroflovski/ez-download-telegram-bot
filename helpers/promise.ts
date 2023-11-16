/**
 * Sleep like in php
 * @param ms
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
