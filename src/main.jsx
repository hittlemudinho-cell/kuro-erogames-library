import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { GamesProvider } from './context/GamesContext'
import './globalcss/style.css'

// Ordem importa: Games usa o idioma (Language) e o login (Auth)
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <LanguageProvider>
            <AuthProvider>
                <GamesProvider>
                    <App />
                </GamesProvider>
            </AuthProvider>
        </LanguageProvider>
    </BrowserRouter>
)
