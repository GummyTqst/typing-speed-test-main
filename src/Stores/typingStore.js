import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRandomText } from "../Logic/textSelector";

export const useTypingStore = create(
  persist(
    (set, get) => ({
      difficulty: "easy",
      textId: null,
      text: "",
      input: "",
      startTime: null,
      endTime: null,
      correctChars: 0,
      mistakes: 0,
      isRunning: false,

      setDifficulty: (difficulty) => set({ difficulty }),

      loadNewText: () => {
        const { difficulty } = get();
        const { id, text } = getRandomText(difficulty);

        set({
          textId: id,
          text,
          input: "",
          startTime: null,
          endTime: null,
          correctChars: 0,
          mistakes: 0,
          isRunning: false,
        });
      },

      start: () => {
        if (!get().startTime) {
          set({ startTime: Date.now(), isRunning: true });
        }
      },

      typeChar: (char) => {
        const { text, input, correctChars, mistakes } = get();
        const index = input.length;

        if (!text[index]) return;

        if (char === text[index]) {
          set({ correctChars: correctChars + 1 });
        } else {
          set({ mistakes: mistakes + 1 });
        }

        set({ input: input + char });
      },

      backspace: () => {
        const { input } = get();
        set({ input: input.slice(0, -1) });
      },

      reset: () => {
        set({
          input: "",
          startTime: null,
          endTime: null,
          correctChars: 0,
          mistakes: 0,
          isRunning: false,
        });
      },
    }),
    {
      name: "typing-storage",
      partialize: (state) => ({
        difficulty: state.difficulty,
        textId: state.textId,
      }),
    }
  )
);
