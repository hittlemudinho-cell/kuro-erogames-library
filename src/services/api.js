// src/services/api.js
// Único lugar do front que fala com o backend hospedado.
// Configure a URL em .env (VITE_API_URL=https://api.seudominio.com)

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export class ApiError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

async function request(path, { signal, ...options } = {}) {
    // credentials: 'include' é o que envia o cookie de sessão para o backend
    const res = await fetch(`${API_URL}${path}`, { credentials: 'include', signal, ...options })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new ApiError(data.error || 'Erro na requisição', res.status)
    return data
}

export const api = {
    // { authenticated, user: { name, email, tiers }, isSubscriber }
    session: (signal) => request('/auth/session', { signal }),

    // { isSubscriber, games: [...] }  (jogos premium vêm com download: null para não assinantes)
    games: (lang, signal) => request(`/api/games/${lang}`, { signal }),

    logout: () => request('/auth/logout', { method: 'POST' }),

    // O login é um redirecionamento completo (não é fetch)
    loginUrl: `${API_URL}/auth/patreon`,
}
