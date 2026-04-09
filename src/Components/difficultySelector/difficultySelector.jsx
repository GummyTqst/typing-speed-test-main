

export default function DifficultySelector({ difficulty, onDifficultyChange }) {
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <div className="difficulty-selector">
      <div className="difficulty-selector__buttons">
        {difficulties.map((level) => (
          <button
            key={level}
            className={`difficulty-selector__btn ${difficulty === level ? 'active' : ''}`}
            onClick={() => onDifficultyChange(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
