
import * as FramerMotion from "framer-motion"
import { memo, useEffect, useRef, useState } from "react"
import "../typing/typingArea.scss"

const Caret = ({ top, left, height }) => {
    return (
        <FramerMotion.motion.div 
            initial={false}
            animate={{ top, left, height }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.4 }}
            className="typing-area__caret"
            style={{ pointerEvents: 'none' }}
        />
    )
}

const Character = memo(({ char, status, isActive }) => {
    const charRef = useRef(null)

    useEffect(() => {
        if (isActive && charRef.current) {
            charRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            })
        }
    }, [isActive])

    let className = 'typing-area__char'

    if (status === 'correct') className += ' typing-area__char--correct'
    if (status === 'error') className += ' typing-area__char--error'
    if (status === 'pending') className += ' typing-area__char--pending'

    return (
        <span ref={charRef} className={className}>
            {char}
            {isActive && (
                <span 
                    id="active-caret-marker"
                    className="typing-area__caret-marker"
                />
            )}
        </span>
    )
},
(prev, next) => 
    prev.char === next.char &&
    prev.status === next.status &&
    prev.isActive === next.isActive
)

const TypingArea = ({ text, typed }) => {
    const containerRef = useRef(null)
    const [caretPos, setCaretPos] = useState({ top: 0, left: 0, height: 0 })
    const [showCaret, setShowCaret] = useState(false)

    useEffect(() => {
        const updateCaretPosition = () => {
            const marker = document.getElementById('active-caret-marker')
            const container = containerRef.current

            if (!marker || !container) {
                setShowCaret(false)
                return
            }

            const markerRect = marker.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()

            const height = markerRect.height * 0.75
            const offsetY = (markerRect.height - height) / 2

            setCaretPos({
                top: markerRect.top - containerRect.top + offsetY,
                left: markerRect.left - containerRect.left - 1,
                height,
            })

            setShowCaret(true)
        }

        updateCaretPosition()
        window.addEventListener('resize', updateCaretPosition)
        return () => window.removeEventListener('resize', updateCaretPosition)
    }, [typed, text])

    return (
        <div className="typing-area">
            <div className="typing-area__caret-layer" aria-hidden="true">
                <FramerMotion.AnimatePresence>
                    {showCaret && (
                        <Caret 
                            top={caretPos.top} 
                            left={caretPos.left} 
                            height={caretPos.height}
                        />
                    )}
                </FramerMotion.AnimatePresence>
            </div>

            <div ref={containerRef} className="typing-area__text">
                {text.split('').map((char, index) => {
                    const isTyped = index < typed.length
                    const isCorrect = isTyped && typed[index] === char
                    const isError = isTyped && !isCorrect
                    const isActive = index === typed.length

                    let status = 'pending'
                    if (isCorrect) status = 'correct'
                    if (isError) status = 'error'

                    return (
                        <Character 
                            key={index} 
                            char={char} 
                            status={status} 
                            isActive={isActive} 
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default memo(TypingArea)