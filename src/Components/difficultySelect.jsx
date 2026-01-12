import { useTypingStore } from "../Stores/typingStore";

export default function DifficultySelect() {
  const { difficulty, setDifficulty, loadNewText } = useTypingStore();

  function handleChange(e) {
    setDifficulty(e.target.value);
    loadNewText();
  }

  return (
    <select value={difficulty} onChange={handleChange}>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  );
}
