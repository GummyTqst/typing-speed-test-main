import { useEffect } from "react";
import { useTypingStore } from "./Stores/typingStore"
import TypingArea from "./Components/typingArea";
import DifficultySelect from "./Components/difficultySelect";
import Stats from "./Components/stats";



function App() {
  const loadNewText = useTypingStore((state) => state.loadNewText);

  useEffect(() => {
    loadNewText();
  }, [])
  

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Typing Test Application</h1>
      <DifficultySelect />
      <TypingArea />
      <Stats />
    </div>
  )
}

export default App
