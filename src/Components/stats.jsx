export default function Stats({ wpm, accuracy, timer, errors }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stats">
      <div className="stats__item">
        <span className="stats__value">{wpm}</span>
        <span className="stats__label">WPM</span>
      </div>
      <div className="stats__item">
        <span className="stats__value">{accuracy}%</span>
        <span className="stats__label">Accuracy</span>
      </div>
      <div className="stats__item">
        <span className="stats__value">{formatTime(timer)}</span>
        <span className="stats__label">Time</span>
      </div>
      <div className="stats__item">
        <span className="stats__value">{errors}</span>
        <span className="stats__label">Errors</span>
      </div>
    </div>
  );
}
