// src/components/GamesStatus.jsx
// Mostra "carregando" ou erro (com botão de tentar de novo). Não renderiza nada quando está tudo certo.
import React from 'react'
import { useGames } from '../context/GamesContext'

function GamesStatus() {
    const { loading, error, reload } = useGames()

    if (loading) return <p className="gamesStatus">Loading games…</p>

    if (error) {
        return (
            <div className="gamesStatus">
                <p>{error}</p>
                <button type="button" onClick={reload}>
                    Try again
                </button>
            </div>
        )
    }

    return null
}

export default GamesStatus
