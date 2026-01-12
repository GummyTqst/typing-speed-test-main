import { useTypingStore } from "../Stores/typingStore";
import { calculateWPM, calculateAccuracy } from "../Logic/wpm";

export default function Stats() {
  const { correctChars, mistakes, startTime } = useTypingStore();

  const wpm = calculateWPM(correctChars, startTime);
  const accuracy = calculateAccuracy(correctChars, mistakes);

  return (
    <div style={{ marginTop: "1rem" }}>
      <p>WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
    </div>
  );
}
