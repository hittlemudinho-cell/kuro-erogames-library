// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('en') // idioma inicial

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    return useContext(LanguageContext)
}