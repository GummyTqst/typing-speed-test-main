import { useTypingStore } from "../Stores/typingStore"

export default function TypingArea() {
  const {
    text,
    input,
    start,
    typeChar,
    backspace,
  } = useTypingStore();

  function handleKeyDown(e) {
    if (e.key === "Backspace") {
      backspace();
      return;
    }

    if (e.key.length === 1) {
      start();
      typeChar(e.key);
    }
  }

  return (
    <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
            outline: "none",
            lineHeight: "1.6",
            cursor: "text",
            userSelect: "none",
            whiteSpace: "pre-wrap",
        }}
    >
        {text.split("").map((char, index) => {
            const typedChar = input[index];

            let color = "#aaa"
            let textDecoration = "none";

            if (typedChar != null) {
                if (typedChar === char) {
                    color = "limegreen";
                } else {
                    color = "red";
                    textDecoration = "underline";
                }
            }

            return (
                <span
                    key={index}
                    style={{ 
                        color, 
                        textDecoration,
                    }}
                >
                    {char}
                </span>
            )
        })}
    </div>
  );
}
