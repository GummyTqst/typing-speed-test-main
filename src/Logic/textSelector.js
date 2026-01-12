import texts from "../Data/data.json"

export function getRandomText(difficulty = "easy") {
  const list = texts[difficulty];

  if (!list || list.length === 0) {
    throw new Error(`No texts found for difficulty: ${difficulty}`);
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
