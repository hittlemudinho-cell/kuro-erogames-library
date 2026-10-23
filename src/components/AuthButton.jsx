// src/components/AuthButton.jsx
// Botão de login/logout que fica na barra do Header.
import React from 'react'
import { useAuth } from '../context/AuthContext'

function AuthButton() {
    const { loading, authenticated, user, isSubscriber, login, logout } = useAuth()

    if (loading) return null

    if (!authenticated) {
        return (
            <button type="button" className="authBtn" onClick={login}>
                Login with Patreon
            </button>
        )
    }

    return (
        <div className="authUser">
            <span className="authName">
                {user?.name}
                {isSubscriber && (
                    <span className="authBadge" title="Active patron">
                        {' '}★
                    </span>
                )}
            </span>
            <button type="button" className="authBtn" onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export default AuthButton
