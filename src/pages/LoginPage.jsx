// src/pages/LoginPage.jsx
// Destino dos redirecionamentos de erro do backend: /login?error=access_denied (etc.)
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'

const MESSAGES = {
    access_denied: 'You cancelled the Patreon authorization.',
    invalid_state: 'Your login session expired or was not started on this browser. Please try again.',
    missing_code: 'Patreon did not return an authorization code. Please try again.',
    session_error: 'We could not save your session. Please try again.',
    auth_failed: 'Login with Patreon failed. Please try again.',
}

function LoginPage() {
    const [searchParams] = useSearchParams()
    const { authenticated, login } = useAuth()
    const error = searchParams.get('error')

    return (
        <div>
            <Header />
            <section className="loginPage">
                <h2>Login</h2>
                {error && <p className="loginError">{MESSAGES[error] || 'Something went wrong.'}</p>}

                {authenticated ? (
                    <p>
                        You are logged in. <Link to="/">Back to home</Link>
                    </p>
                ) : (
                    <button type="button" className="authBtn" onClick={login}>
                        Login with Patreon
                    </button>
                )}
            </section>
        </div>
    )
}

export default LoginPage
