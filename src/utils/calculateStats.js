/**
 * @param {number} totalTyped
 * @param {number} errors
 * @returns {number}
 */

export const calculateAccuracy = (totalTyped, errors) => {
    if (totalTyped === 0) return 100

    const correctTyped = totalTyped - errors
    const accuracy = (correctTyped / totalTyped) * 100

    return Math.max(0, Math.round(accuracy))
}

/**
 * Calculate words per minits (WPM)
 * @param {number} correcCharCount
 * @param {number} timeElapsedSecons
 * @returns {number}
 */
export const calculateWPM = (correcCharCount, timeElapsedSecons) => {
    if (timeElapsedSecons === 0) return 0

    const words = correcCharCount / 5
    const minutes = timeElapsedSecons / 60

    const wpm = words / minutes

    return Math.round(wpm)
}