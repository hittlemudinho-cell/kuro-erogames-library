import React, { useEffect, useState } from 'react'
import '../globalcss/AgeGate.css'

const STORAGE_KEY = 'kuro_age_verified'
// Para onde o usuário vai se clicar em "No"
const EXIT_URL = 'https://www.google.com'

function readVerified() {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
        return false
    }
}

function AgeGate() {
    const [verified, setVerified] = useState(readVerified)

    // Trava a rolagem da página enquanto o aviso está aberto
    useEffect(() => {
        if (verified) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [verified])

    if (verified) return null

    const handleYes = () => {
        try {
            localStorage.setItem(STORAGE_KEY, 'true')
        } catch {
            /* sem storage: pergunta de novo na próxima visita */
        }
        setVerified(true)
    }

    const handleNo = () => {
        window.location.href = EXIT_URL
    }

    return (
        <div
            className="ageGateOverlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ageGateTitle"
            aria-describedby="ageGateText"
        >
            <div className="ageGateBox">
                <h2 id="ageGateTitle">Age Verification</h2>
                <p id="ageGateText">
                    <strong>KURO</strong> contains adult content intended only for people
                    who are <strong>18 years of age or older</strong>.
                </p>
                <p className="ageGateQuestion">Are you over 18 years old?</p>

                <div className="ageGateBtns">
                    <button type="button" className="ageGateYes" onClick={handleYes}>
                        Yes, I am 18+
                    </button>
                    <button type="button" className="ageGateNo" onClick={handleNo}>
                        No, take me out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AgeGate