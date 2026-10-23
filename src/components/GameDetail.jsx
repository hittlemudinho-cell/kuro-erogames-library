import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../globalcss/style.css'
import { useGames } from '../context/GamesContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import GamesStatus from './GamesStatus'

// Troque pela URL da sua página no Patreon
const PATREON_PAGE = 'https://www.patreon.com/cw/DeepStateHub'

const SUPPORTED_LANGS = ['pt', 'en', 'es']

/* Ícones (SVG inline, herdam a cor do texto) */
const PATHS = {
    translate: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4.500 3L5 15h1.800l.5-1.500h2.400l.5 1.500H12L9.500 8zm.5 1.800.8 2.200H7.200zM14 9v1.500h3.500c-.3 1-1 1.900-2 2.500l.9 1.200c1.300-.8 2.200-2 2.600-3.700H20V9h-2.500V8H16v1z',
    monitor: 'M3 4h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-7v2h3v2H7v-2h3v-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    calendar: 'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 10h14v10H5z',
    download: 'M11 3h2v9.200l3.300-3.300 1.400 1.400L12 16 6.300 10.300l1.400-1.400L11 12.200zM5 19h14v2H5z',
}

function Icon({ name, size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={PATHS[name]} />
        </svg>
    )
}

function GameDetail() {
    const { lang, id } = useParams()
    const { lang: currentLang, setLang } = useLanguage()
    const { games, loading, error } = useGames()
    const { loading: authLoading, authenticated, isSubscriber, login } = useAuth()

    const langIsValid = SUPPORTED_LANGS.includes(lang)

    // A lista carregada é a do idioma selecionado no site. Se a URL pede outro idioma
    // (link compartilhado), sincroniza o idioma e espera a lista certa chegar.
    useEffect(() => {
        if (langIsValid && lang !== currentLang) setLang(lang)
    }, [langIsValid, lang, currentLang, setLang])

    const game = langIsValid ? games.find((g) => String(g.id) === String(id)) : null

    if (langIsValid && (loading || error || lang !== currentLang)) {
        return (
            <div className="gdPage">
                <GamesStatus />
                <Link to="/" className="gdBtn">
                    ← Back
                </Link>
            </div>
        )
    }

    if (!game) {
        return (
            <div className="notFound">
                <h2>Game not found!</h2>
                <Link to="/">Back to Home</Link>
            </div>
        )
    }

    // Premium sem acesso: a API já enviou download: null
    const locked = Boolean(game.premium) && !isSubscriber

    const fields = [
        { icon: 'translate', label: 'Idioma', value: game.language },
        { icon: 'monitor', label: 'Disponível para', value: game.os },
    ].filter((f) => f.value)

    const tags = Array.isArray(game.tags) ? game.tags : []
    const download = locked ? null : game.download
    const hasDownload = download?.android || download?.pc
    const hasMeta = game.developer || game.author || game.released_at
    const authorName = game.developer || game.author

    return (
        <article className="gdPage">
            <header className="gdTop">
                <h1 className="gdTitle">
                    {game.title}
                    {game.premium && ' ★'}
                </h1>
                <Link to="/" className="gdBtn">
                    ← Back
                </Link>
            </header>

            {hasMeta && (
                <div className="gdMeta">
                    {authorName && (
                        <>
                            <span className="gdAvatar">{authorName.charAt(0)}</span>
                            <span>
                                Por <span className="gdAuthor">{authorName}</span>
                            </span>
                        </>
                    )}
                    {game.released_at && (
                        <span className="gdMetaItem">
                            <Icon name="calendar" size={18} /> Updated on {game.released_at}
                        </span>
                    )}
                </div>
            )}

            <div className="gdBody">
                <div className="gdCover">
                    <img src={game.cover} alt={game.title} />
                </div>

                <div className="gdInfo">
                    {fields.length > 0 && (
                        <dl className="gdFields">
                            {fields.map((f) => (
                                <div className="gdRow" key={f.label}>
                                    <dt className="gdLabel">
                                        <Icon name={f.icon} /> {f.label}
                                    </dt>
                                    <dd className="gdValue">
                                        {Array.isArray(f.value) ? f.value.join(', ') : f.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {tags.length > 0 && (
                        <ul className="gdTags">
                            {tags.map((tag, i) => (
                                <li key={`${tag}-${i}`}>{tag}</li>
                            ))}
                        </ul>
                    )}

                    {/* Premium bloqueado */}
                    {locked && (
                        <div className="gdDownload gdLocked">
                            <h2 className="gdSectionTitle">🔒 Premium</h2>
                            {authLoading ? (
                                <p>Checking your account…</p>
                            ) : !authenticated ? (
                                <>
                                    <p>{game.lockedMessage || 'This download is for Patreon supporters.'}</p>
                                    <p>Log in to check your subscription.</p>
                                    <button type="button" className="gdDlBtn" onClick={login}>
                                        Login with Patreon
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>Your Patreon account does not have an active subscription.</p>
                                    <a
                                        href={PATREON_PAGE}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gdDlBtn"
                                    >
                                        Become a patron
                                    </a>
                                </>
                            )}
                        </div>
                    )}

                    {hasDownload && (
                        <div className="gdDownload">
                            <h2 className="gdSectionTitle">Download</h2>
                            <div className="gdDownloadBtns">
                                {download.android && (
                                    <a
                                        href={download.android}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gdDlBtn android"
                                    >
                                        <Icon name="download" size={20} /> Android
                                    </a>
                                )}
                                {download.pc && (
                                    <a
                                        href={download.pc}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gdDlBtn pc"
                                    >
                                        <Icon name="download" size={20} /> PC
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <section className="gdSynopsis">
                <h2 className="gdSectionTitle">Sinopse</h2>
                <p>{game.synops || 'Sinopse não disponível.'}</p>
            </section>
        </article>
    )
}

export default GameDetail
