import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../globalcss/style.css'
import { useLanguage } from '../context/LanguageContext'
import AuthButton from './AuthButton'
import SearchPanel from './SearchPanel'

// Itens do menu: quem tem "children" vira dropdown.
// Filhos com "lang" trocam o idioma (botão); filhos com "href" são links.
const MENU = [
    { label: 'Home', href: '/' },
    {
        label: 'Platforms',
        children: [
            { label: 'PC', href: '/category/pc' },
            { label: 'Android', href: '/category/android' },
        ],
    },
    {
        label: 'Language',
        children: [
            { label: 'Portuguese', lang: 'pt' },
            { label: 'English', lang: 'en' },
            { label: 'Spanish', lang: 'es' },
        ],
    },
    { label: 'Guides', href: '/guias' },
]

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [openSub, setOpenSub] = useState(null) // dropdown aberto no mobile
    const [searchOpen, setSearchOpen] = useState(false)
    const { lang, setLang } = useLanguage()
    const { pathname: currentPath } = useLocation()

    const handleLang = (code) => {
        setLang(code)
        setOpenSub(null)
        setMenuOpen(false)
    }

    return (
        <div className="contentHead">
            {/* Banner: título */}
            <div className="header">
                <Link to="/" className="brand">
                    <div className="brandText">
                        <h2>KURO</h2>
                    </div>
                </Link>
                <AuthButton />
            </div>

            {/* Modal de busca (abre pela lupa) */}
            <SearchPanel
                variant="modal"
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />

            {/* Barra de navegação */}
            <nav className="headerBtns" aria-label="Main menu">
                <button
                    className="menuToggle"
                    aria-expanded={menuOpen}
                    aria-controls="primaryMenu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    Menu
                </button>

                <ul id="primaryMenu" className={menuOpen ? 'open' : ''}>
                    {MENU.map((item) =>
                        item.children ? (
                            <li
                                key={item.label}
                                className={`hasSub ${openSub === item.label ? 'subOpen' : ''}`}
                            >
                                <button
                                    className="subTrigger"
                                    aria-haspopup="true"
                                    aria-expanded={openSub === item.label}
                                    onClick={() =>
                                        setOpenSub(openSub === item.label ? null : item.label)
                                    }
                                >
                                    {item.label}
                                    <svg
                                        className="caret"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                                <ul className="subMenu">
                                    {item.children.map((sub) => (
                                        <li key={sub.label}>
                                            {sub.lang ? (
                                                <button
                                                    className={lang === sub.lang ? 'active' : ''}
                                                    aria-pressed={lang === sub.lang}
                                                    onClick={() => handleLang(sub.lang)}
                                                >
                                                    {sub.label}
                                                </button>
                                            ) : (
                                                <Link
                                                    to={sub.href}
                                                    className={currentPath === sub.href ? 'active' : ''}
                                                    onClick={() => {
                                                        setOpenSub(null)
                                                        setMenuOpen(false)
                                                    }}
                                                >
                                                    {sub.label}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ) : (
                            <li key={item.label}>
                                <Link
                                    to={item.href}
                                    className={currentPath === item.href ? 'active' : ''}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    )}

                    {/* Lupa ao lado de Guides */}
                    <li>
                        <button
                            type="button"
                            className="searchTrigger"
                            aria-label="Open search"
                            onClick={() => {
                                setSearchOpen(true)
                                setMenuOpen(false)
                                setOpenSub(null)
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Header