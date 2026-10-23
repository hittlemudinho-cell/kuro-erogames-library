// src/context/GamesContext.jsx
// Busca a lista de jogos na API (no idioma atual) e compartilha com todos os componentes.
// Refaz a busca quando o idioma muda ou quando o login/logout muda o acesso premium.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { useLanguage } from './LanguageContext'
import { useAuth } from './AuthContext'

const GamesContext = createContext()

export function GamesProvider({ children }) {
    const { lang } = useLanguage()
    const { loading: authLoading, authenticated, isSubscriber } = useAuth()

    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        // Espera saber se está logado, para não buscar duas vezes
        if (authLoading) return

        const controller = new AbortController()
        setLoading(true)
        setError(null)

        api.games(lang, controller.signal)
            .then((data) => {
                setGames(Array.isArray(data.games) ? data.games : [])
                setLoading(false)
            })
            .catch((err) => {
                if (err.name === 'AbortError') return
                setGames([])
                setError(err.message || 'Não foi possível carregar os jogos.')
                setLoading(false)
            })

        return () => controller.abort()
    }, [lang, authLoading, authenticated, isSubscriber, reloadKey])

    const reload = useCallback(() => setReloadKey((k) => k + 1), [])

    const value = useMemo(
        () => ({ games, loading: loading || authLoading, error, reload }),
        [games, loading, authLoading, error, reload]
    )

    return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
}

export function useGames() {
    return useContext(GamesContext)
}
