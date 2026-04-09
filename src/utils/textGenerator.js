import data from '../Data/data.json'

const passageData = data

/** 
 * @param {'easy | medium | hard'} difficulty
 * @returns {{ id: string, text: string}}
 */

export const getRandomPassage = (difficulty = 'easy') => {
    const passages = passageData[difficulty]

    // Fallback check: if passages is undefined or empty
    if (!passages || passages.length === 0) {
        console.error(`No passages found for difficulty: ${difficulty}`)
        return passageData['easy'][0]
    }

    const randomIndex = Math.floor(Math.random() * passages.length)
    return passages[randomIndex]
} 