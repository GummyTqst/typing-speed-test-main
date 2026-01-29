import { useTypingStore } from "../../Stores/typingStore";

export default function DifficultySelect() {
  const { difficulty, setDifficulty, loadNewText } = useTypingStore();


  function handleChange(e) {
    setDifficulty(e.target.value);
    loadNewText();
  }

  return (
    <div className="selector">
        {/* Desktop */}
        <div className="selector__buttons">
          {["easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              className={difficulty === level ? "active" : ""}
              onClick={() => handleChange(level)}
            >

            </button>
          ))}
        </div>
    </div>
  );
}
