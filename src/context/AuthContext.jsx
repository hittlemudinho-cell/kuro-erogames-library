// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [session, setSession] = useState({ authenticated: false, user: null, isSubscriber: false })
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    const refresh = useCallback(async () => {
        try {
            const data = await api.session()
            setSession({
                authenticated: Boolean(data.authenticated),
                user: data.user ?? null,
                isSubscriber: Boolean(data.isSubscriber),
            })
        } catch {
            setSession({ authenticated: false, user: null, isSubscriber: false })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refresh()
    }, [refresh])

    // Remove ?logged=true da URL depois que o backend redireciona de volta.
    // O estado de login vem de api.session(), então o parâmetro não é necessário.
    useEffect(() => {
        if (searchParams.has('logged')) {
            const next = new URLSearchParams(searchParams)
            next.delete('logged')
            setSearchParams(next, { replace: true })
        }
    }, [searchParams, setSearchParams])

    const login = () => {
        window.location.href = api.loginUrl
    }

    const logout = async () => {
        try {
            await api.logout()
        } finally {
            setSession({ authenticated: false, user: null, isSubscriber: false })
        }
    }

    return (
        <AuthContext.Provider value={{ ...session, loading, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}