import { useCallback, useRef, useState } from "react";
import TypingArea from "./Components/typing/TypingArea";
import { getRandomPassage } from "./utils/textGenerator";
import Stats from "./Components/stats";
import DifficultySelector from "./Components/difficultySelector/difficultySelector";

import "./app.scss";

function getNewContent(diff) {
  return getRandomPassage(diff).text;
}

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [text, setText] = useState(() => getNewContent('easy'));
  const [typed, setTyped] = useState("");
  const [gameStatus, setGameStatus] = useState('idle');
  const [timer, setTimer] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const inputRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const textRef = useRef(text);
  const typedRef = useRef(typed);
  const totalKeystrokesRef = useRef(totalKeystrokes);
  const errorsRef = useRef(errors);

  const calculateWPM = useCallback((charCount, seconds) => {
    if (seconds === 0) return 0;
    const words = charCount / 5;
    const minutes = seconds / 60;
    return Math.round(words / minutes);
  }, []);

  const calculateAccuracy = useCallback((total, errs) => {
    if (total === 0) return 100;
    const correct = total - errs;
    return Math.round((correct / total) * 100);
  }, []);

  const startGame = useCallback(() => {
    setGameStatus('running');
    setTyped("");
    setErrors(0);
    setTotalKeystrokes(0);
    setWpm(0);
    setAccuracy(100);
    setTimer(0);
    startTimeRef.current = Date.now();
    inputRef.current?.focus();

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimer(elapsed);
      setWpm(calculateWPM(typedRef.current.length, elapsed));
    }, 100);
  }, [calculateWPM]);

  const handleInput = useCallback((e) => {
    const val = e.target.value;

    if (gameStatus === 'idle' && val.length > 0) {
      startGame();
    }

    setTotalKeystrokes(prev => prev + 1);
    totalKeystrokesRef.current += 1;

    if (val.length > typedRef.current.length) {
      const charIndex = val.length - 1;
      if (val[charIndex] !== textRef.current[charIndex]) {
        setErrors(prev => prev + 1);
        errorsRef.current += 1;
      }
    }

    setTyped(val);
    typedRef.current = val;
    setAccuracy(calculateAccuracy(totalKeystrokesRef.current, errorsRef.current));

    if (val.length === textRef.current.length) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setGameStatus('finished');
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setWpm(calculateWPM(textRef.current.length, elapsed));
      setAccuracy(calculateAccuracy(totalKeystrokesRef.current, errorsRef.current));
    }
  }, [gameStatus, startGame, calculateWPM, calculateAccuracy]);

  const handleDifficultyChange = useCallback((newDifficulty) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setDifficulty(newDifficulty);
    setGameStatus('idle');
    setTyped("");
    setTimer(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalKeystrokes(0);
    const newText = getNewContent(newDifficulty);
    setText(newText);
    textRef.current = newText;
    typedRef.current = "";
    totalKeystrokesRef.current = 0;
    errorsRef.current = 0;
  }, []);

  const handleNewTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setGameStatus('idle');
    setTyped("");
    setTimer(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalKeystrokes(0);
    const newText = getNewContent(difficulty);
    setText(newText);
    textRef.current = newText;
    typedRef.current = "";
    totalKeystrokesRef.current = 0;
    errorsRef.current = 0;
  }, [difficulty]);

  return (
    <div className="app">
      {gameStatus !== 'finished' && (
        <header className="app__header">
          <svg className="app__logo" width="140" height="32" viewBox="0 0 267 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="url(#paint0_linear)" fillRule="evenodd" d="M22.827 15.626a1.155 1.155 0 1 1 .001-2.308 1.155 1.155 0 0 1-.001 2.308m-2.279 3.84a1.156 1.156 0 0 1 0-2.31 1.156 1.156 0 0 1 0 2.31m-.784 4.746h-7.526a1 1 0 0 1 0-2h7.526a1 1 0 0 1 0 2m-9.48-5.902a1.156 1.156 0 1 1 1.155 1.156 1.156 1.156 0 0 1-1.155-1.156M9.16 15.626a1.155 1.155 0 1 1 0-2.308 1.155 1.155 0 0 1 0 2.308m4.557-2.31a1.155 1.155 0 1 1 0 2.311 1.155 1.155 0 0 1 0-2.31m2.276 3.84a1.156 1.156 0 0 1 0 2.31 1.156 1.156 0 0 1 0-2.31m2.277-3.84a1.155 1.155 0 1 1-.001 2.311 1.155 1.155 0 0 1 0-2.31m3.369-4.77h-4.447v-.185a3.596 3.596 0 0 0-3.578-3.538H12.27a.67.67 0 0 1-.668-.66 1 1 0 0 0-2 .019 2.67 2.67 0 0 0 2.657 2.641h1.335c.809-.02 1.586.696 1.598 1.552v.171h-4.83c-4.4 0-7.028 2.579-7.028 6.898v6.497c-.007 2.084.618 3.817 1.808 5.01 1.224 1.229 3.024 1.877 5.208 1.877h11.289c4.4 0 7.028-2.574 7.028-6.884v-6.4c0-4.382-2.628-6.998-7.028-6.998" clipRule="evenodd"/>
            <path fill="#fff" d="M40.227 25.104a7 7 0 0 1-2.904 2.568q-1.776.864-4.224.864-2.544 0-4.464-1.056a8 8 0 0 1-3-2.904 10 10 0 0 1-1.056-4.2 10 10 0 0 1 1.056-4.224 7.7 7.7 0 0 1 2.952-2.904q1.872-.936 4.416-.936 2.304 0 4.08.864a7 7 0 0 1 2.904 2.568q1.08 1.656 1.08 3.936v1.392h-15.48q.096 1.584.864 2.688.768 1.08 1.968 1.632 1.2.552 2.664.552 1.872 0 3.096-.552t1.848-1.344l1.368 2.16Zm-5.64-8.616q-1.104 0-1.992.48-.864.456-1.368 1.344-.504.864-.6 2.016h9.408q-.12-1.2-.672-2.088-.528-.912-1.392-1.392-.864-.504-1.992-.504t-1.992.504q-.888.48-1.392 1.392-.504.888-.624 2.016h-.096M60.6 18.12q.12 1.128.48 1.704.384.576 1.2.576.672 0 1.056-.432.384-.456.384-1.128 0-.48-.264-1.032-.24-.576-.792-1.392l-1.056-1.56a4 4 0 0 0-.84-.96 1.6 1.6 0 0 0-.864-.264q-.528 0-.864.288-.336.288-.336.768v.12h-3.216v-.144q0-1.68.936-2.856.96-1.2 2.64-1.2 1.392 0 2.208.768.816.744.888 2.184h-3.384q-.12-.504-.528-.792-.384-.312-.96-.312-.576 0-.912.312-.312.312-.312.792v.12h-.096q-.096-1.2-.864-1.968-.768-.792-2.064-.792-1.2 0-1.992.72t-.792 2.016q0 1.2.792 1.968t2.064.768q1.392 0 2.232-.84.84-.84.936-2.28h-2.904v2.736h6.144Zm7.176 1.08q-.264-.36-.792-.6-.504-.264-1.176-.264-.816 0-1.32.432t-.504 1.176v7.776h-3.48V14.76h3.48v2.04q.504-.984 1.392-1.512.888-.552 1.944-.552 1.008 0 1.728.432.72.408 1.056 1.176l.12.264Zm4.392 5.88q-1.68 0-2.976-.576a6.4 6.4 0 0 1-2.136-1.536 7.4 7.4 0 0 1-1.296-2.184 7.5 7.5 0 0 1-.432-2.496v-.48q0-1.32.432-2.52a7 7 0 0 1 1.296-2.184 5.9 5.9 0 0 1 2.088-1.512q1.272-.576 2.88-.576 2.112 0 3.552.96a6.15 6.15 0 0 1 2.232 2.472q.768 1.512.768 3.312v1.296h-11.856q.144 1.176.888 1.992.744.792 1.824 1.176 1.08.384 2.376.384 1.584 0 2.616-.504t1.488-1.176l1.416 2.04Zm-3.312-8.064q-.984 0-1.752.456t-1.224 1.32q-.456.864-.552 2.088h6.816q-.072-1.248-.576-2.136-.504-.912-1.344-1.368-.84-.456-1.848-.456Zm15.096 8.064q-1.68 0-2.976-.576a6.4 6.4 0 0 1-2.136-1.536 7.4 7.4 0 0 1-1.296-2.184 7.5 7.5 0 0 1-.432-2.496v-.48q0-1.32.432-2.52a7 7 0 0 1 1.296-2.184 5.9 5.9 0 0 1 2.088-1.512q1.272-.576 2.88-.576 2.112 0 3.552.96a6.15 6.15 0 0 1 2.232 2.472q.768 1.512.768 3.312v1.296h-11.856q.144 1.176.888 1.992.744.792 1.824 1.176 1.08.384 2.376.384 1.584 0 2.616-.504t1.488-1.176l1.416 2.04Zm-3.312-8.064q-.984 0-1.752.456t-1.224 1.32q-.456.864-.552 2.088h6.816q-.072-1.248-.576-2.136-.504-.912-1.344-1.368-.84-.456-1.848-.456ZM104.64 6v19.44h-3.48V6h3.48ZM122.64 6.24q2.76 0 4.44 1.368 1.704 1.368 1.704 3.912v.96h-9.456q.24 1.56 1.32 2.568 1.08.984 2.76 1.488t3.624.504q1.824 0 3.36-.36t2.64-.936l.984 2.64q-.864.6-2.064.96-1.2.384-2.64.384-2.52 0-4.32-1.056a7.5 7.5 0 0 1-2.904-2.976q-1.008-1.92-1.008-4.44 0-2.52 1.032-4.392a7.4 7.4 0 0 1 2.904-2.952q1.8-1.08 4.176-1.08Zm.192 2.736q-1.368 0-2.4.6-1.032.576-1.608 1.656-.576 1.056-.624 2.424h8.16q-.096-1.368-.72-2.424-.624-1.08-1.632-1.656-1.008-.6-2.328-.6Zm14.52 16.464V14.76h3.48v2.808q.504-.984 1.44-1.44.96-.456 2.304-.456 1.488 0 2.568.6 1.08.576 1.632 1.656.576 1.056.576 2.472v7.08h-3.48v-6.456q0-1.128-.624-1.776t-1.656-.648q-1.032 0-1.68.648t-.648 1.776v6.456h-3.48V14.76h3.48v1.416q.552-1.008 1.392-1.416t1.92-.408q1.68 0 2.736.696t1.368 2.064q.504-1.416 1.416-2.088.936-.696 2.184-.696 1.464 0 2.52.624 1.056.6 1.584 1.752.552 1.128.552 2.664v7.368h-3.48v-6.528q0-1.104-.672-1.752-.648-.648-1.704-.648-.984 0-1.608.624-.6.624-.6 1.776v6.528h-3.48v-6.528q0-1.104-.672-1.752-.648-.648-1.704-.648-.984 0-1.608.624-.6.624-.6 1.776v6.528h-3.48Zm30.624-7.512q.12 1.128.48 1.704.384.576 1.2.576.672 0 1.056-.432.384-.456.384-1.128 0-.48-.264-1.032-.24-.576-.792-1.392l-1.056-1.56a4 4 0 0 0-.84-.96 1.6 1.6 0 0 0-.864-.264q-.528 0-.864.288-.336.288-.336.768v.12h-3.216v-.144q0-1.68.936-2.856.96-1.2 2.64-1.2 1.392 0 2.208.768.816.744.888 2.184h-3.384q-.12-.504-.528-.792-.384-.312-.96-.312-.576 0-.912.312-.312.312-.312.792v.12h-.096q-.096-1.2-.864-1.968-.768-.792-2.064-.792-1.2 0-1.992.72t-.792 2.016q0 1.2.792 1.968t2.064.768q1.392 0 2.232-.84.84-.84.936-2.28h-2.904v2.736h6.144Z"/>
            <defs>
              <linearGradient id="paint0_linear" x1="4.5" y1="1" x2="39" y2="1" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff"/>
                <stop offset="1" stopColor="#fff" stopOpacity=".4"/>
              </linearGradient>
            </defs>
          </svg>
        </header>
      )}

      <section className="app__top">
        <Stats wpm={wpm} accuracy={accuracy} timer={timer} errors={errors} />
        {gameStatus !== 'finished' && (
          <DifficultySelector 
            difficulty={difficulty} 
            onDifficultyChange={handleDifficultyChange} 
          />
        )}
      </section>

      <main
        className="typing"
        onClick={() => inputRef.current?.focus()}
      >
        <div className={`typing__content ${gameStatus === 'idle' ? 'typing__content--idle' : ''}`}>
          <TypingArea text={text} typed={typed} />
        </div>

        {gameStatus === 'idle' && (
          <div className="typing__overlay">
            <button
              className="typing__start-btn"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
            >
              Start Test
            </button>
            <p className="typing__hint">
              Click here or press any key to begin
            </p>
          </div>
        )}

        {gameStatus === 'running' && (
          <div className="typing__live-stats">
            <span className="typing__live-wpm">{wpm} WPM</span>
          </div>
        )}

        {gameStatus === 'finished' && (
          <div className="typing__results">
            <div className="typing__results-header">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#22c55e" strokeWidth="4"/>
                <path d="M20 32l8 8 16-16" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="typing__results-title">Test Complete</h2>
            </div>
            <div className="typing__results-stats">
              <div className="typing__result-item typing__result-item--primary">
                <span className="typing__result-value">{wpm}</span>
                <span className="typing__result-label">WPM</span>
              </div>
              <div className="typing__result-item">
                <span className="typing__result-value">{accuracy}%</span>
                <span className="typing__result-label">Accuracy</span>
              </div>
            </div>
            <div className="typing__results-secondary">
              <div className="typing__result-item">
                <span className="typing__result-value">{errors}</span>
                <span className="typing__result-label">Errors</span>
              </div>
              <div className="typing__result-item">
                <span className="typing__result-value">{text.length}</span>
                <span className="typing__result-label">Characters</span>
              </div>
            </div>
            <div className="typing__results-actions">
              <button className="typing__restart-btn" onClick={handleNewTest}>
                Try Again
              </button>
              <button className="typing__new-test-btn" onClick={handleNewTest}>
                New Text
              </button>
            </div>
          </div>
        )}

        <input 
          ref={inputRef}
          className="typing__input"
          value={typed}
          onChange={handleInput}
          autoComplete="off"
          spellCheck="false"
          disabled={gameStatus === 'finished'}
        />
      </main>
    </div>
  );
}

export default App;
