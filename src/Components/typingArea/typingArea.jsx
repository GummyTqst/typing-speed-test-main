import { useTypingStore } from "../../Stores/typingStore"

import "../typingArea/typingArea.sass";

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
            className="typing-area"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {text.split("").map((char, index) => {
                const typedChar = input[index];
                const isCursor = index === input.length

                let className ="typing-area__char"

                if (typedChar != null) {
                    className += typedChar === char
                        ? " correct"
                        : " incorrect"
                }

                return (
                    <span
                        key={index}
                        className={className}
                    >
                        {isCursor && <span className="typing-area__cursor" />}
                        {char}
                    </span>
                )
            })}
        </div>
    );
}
