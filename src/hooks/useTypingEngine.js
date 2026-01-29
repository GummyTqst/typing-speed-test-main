import { use, useCallback, useEffect, useRef, useState } from "react";
import { calculateAccuracy, calculateWPM } from "../utils/calculateStats";

const useTypingEngine = (mode, timeOption, onFinish) => {
    const [status, setStatus] = useState('idle'); // 'idle', 'running', 'finished'
    const [timer, setTimer] = useState(mode === 'timed' ? timeOption : 0)
    const [typed, setTyped] = useState('')
    const [errors, setErrors] = useState(0)
    const [totalKeystrokes, setTotalKeystrokes] = useState(0)
    const [wpmHistory, setWpmHistory] = useState([])

    // Refs to track latest state without causing re-renders
    const typedRef = useRef(typed)

    useEffect(() => {
        typedRef.current = typed
    }, [typed])

    const hasFinished = useRef(false)

    const getInitialTimer = useCallback(() => {
        return mode === 'timed' ? timeOption : 0
    }, [mode, timeOption])

    const startGame = useCallback(() => {
        setStatus('running')
        setTimer(getInitialTimer())
        setTyped('')
        setErrors(0)
        setTotalKeystrokes(0)
        setWpmHistory([])
        hasFinished.current = false
        typedRef.current = ''
    }, [getInitialTimer])

    const stopGame = useCallback(() => {
        setStatus('finished')

        if (!hasFinished.current) {
            hasFinished.current = true

            const timeElapsed = 
                mode === 'timed' ? (timeOption - timer) : timer

            const finalWpm = calculateWPM(typed.length, timeElapsed)
            const finalAccuracy = calculateAccuracy(totalKeystrokes, errors)
            
            if (onFinish) {
                onFinish(finalWpm, finalAccuracy, wpmHistory)
            }
        }
    }, [
        mode,
        timeOption,
        timer,
        typed.length,
        totalKeystrokes,
        errors,
        onFinish,
        wpmHistory
    ])

    const resetEngine = useCallback(() => {
        setStatus('idle')
        setTimer(getInitialTimer())
        setTyped('')
        setErrors(0)
        setTotalKeystrokes(0)
        setWpmHistory([])
        hasFinished.current = false
        typedRef.current = ''
    }, [getInitialTimer])

    const stopGameRef = useRef(stopGame)

    useEffect(() => {
        stopGameRef.current = stopGame
    }, [stopGame])

    // Timer logic
    useEffect(() => {
        if (status !== 'running') return

        const intervalId = setInterval(() => {
            setTimer((prevTimer) => {
                let currentElapsed = 0

                if (mode === 'timed') {
                    currentElapsed = timeOption - prevTimer
                } else {
                    currentElapsed = prevTimer
                }

                if (currentElapsed > 0) {
                    const currentWpm = calculateWPM(
                        typedRef.current.length,
                        currentElapsed
                    )

                    setWpmHistory((prev) => [
                        ...prev,
                        { time: currentElapsed, wpm: currentWpm }
                    ])
                }

                if (mode === 'timed') {
                    if (prevTimer <= 1) {
                        clearInterval(intervalId)
                        stopGameRef.current()
                        return 0
                    }
                    return prevTimer - 1
                }

                return prevTimer + 1
            })
        }, 1000)

        return () => clearInterval(intervalId)
    }, [status, mode, timeOption])

    const handleInput = useCallback(
        (e, targetText) => {
            if (status === 'finished') return

            const val = e.target.value

            if (status === 'idle') startGame()

            setTotalKeystrokes((prev) => prev + 1)

            if (val.length > typed.length) {
                const charIndex = val.length - 1
                if (val[charIndex] !== targetText[charIndex]) {
                    setErrors((prev) => prev + 1)
                }
            }

            setTyped(val)

            if (val.length === targetText.length) {
                stopGame()
            }
        }, [status, typed, startGame, stopGame])

    const timeElapsed = 
        mode === 'timed' ? (timeOption - timer) : timer
        
    const accuracy = calculateAccuracy(totalKeystrokes, errors)
    const wpm = calculateWPM(typed.length, timeElapsed)

    return {
        status,
        timer,
        typed,
        errors,
        accuracy,
        wpm,
        totalKeystrokes,
        wpmHistory,
        startGame,
        resetEngine,
        handleInput
    }
}

export default useTypingEngine;