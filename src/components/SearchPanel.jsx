// src/components/SearchPanel.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PLATFORMS = [
    { value: '', label: 'All platforms' },
    { value: 'pc', label: 'PC' },
    { value: 'android', label: 'Android' },
]

const SCOPES = [
    { value: 'all', label: 'Search titles and body' },
    { value: 'title', label: 'Search titles only' },
]

const PERIODS = (word) => [
    { value: '', label: `${word} any time` },
    { value: 'day', label: `${word} in the last day` },
    { value: 'week', label: `${word} in the last week` },
    { value: 'month', label: `${word} in the last month` },
    { value: 'year', label: `${word} in the last year` },
]

const Icon = ({ children }) => (
    <svg
        className="spIcon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
)

const IconDoc = () => (
    <Icon>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Icon>
)
const IconEdit = () => (
    <Icon>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </Icon>
)
const IconCalendar = () => (
    <Icon>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </Icon>
)
const Chevron = () => (
    <svg
        className="spChevron"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
)

function FilterSelect({ icon, label, value, onChange, options }) {
    return (
        <label className="spFilter">
            {icon}
            <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <Chevron />
        </label>
    )
}

/**
 * Painel de busca em modal.
 * open / onClose controlam a visibilidade.
 * variant="page" ainda pode ser usado na página de resultados se quiser.
 */
function SearchPanel({ open = false, onClose, variant = 'modal', children = null }) {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const inputRef = useRef(null)

    const [query, setQuery] = useState(params.get('q') || '')
    const [platform, setPlatform] = useState(params.get('platform') || '')
    const [scope, setScope] = useState(params.get('scope') || 'all')
    const [created, setCreated] = useState(params.get('created') || '')
    const [updated, setUpdated] = useState(params.get('updated') || '')
    const [showFilters, setShowFilters] = useState(true)

    // Sincroniza com a URL
    useEffect(() => {
        setQuery(params.get('q') || '')
        setPlatform(params.get('platform') || '')
        setScope(params.get('scope') || 'all')
        setCreated(params.get('created') || '')
        setUpdated(params.get('updated') || '')
    }, [params])

    // Foco no input + trava o scroll do body quando o modal abre
    useEffect(() => {
        if (variant !== 'modal') return
        if (open) {
            document.body.classList.add('spModalOpen')
            // pequeno delay para o input existir no DOM
            const t = setTimeout(() => inputRef.current?.focus(), 50)
            return () => {
                clearTimeout(t)
                document.body.classList.remove('spModalOpen')
            }
        }
        document.body.classList.remove('spModalOpen')
    }, [open, variant])

    // Fecha com Escape
    useEffect(() => {
        if (!open || variant !== 'modal') return
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, variant, onClose])

    const submit = (e) => {
        e.preventDefault()
        const q = query.trim()
        if (!q) return
        const next = new URLSearchParams({ q })
        if (platform) next.set('platform', platform)
        if (scope !== 'all') next.set('scope', scope)
        if (created) next.set('created', created)
        if (updated) next.set('updated', updated)
        const sort = params.get('sort')
        if (sort) next.set('sort', sort)
        navigate(`/busca?${next.toString()}`)
        onClose?.() // fecha o modal após pesquisar
    }

    const filters = (
        <div className="spFilters">
            <FilterSelect icon={<IconDoc />} label="Platform" value={platform} onChange={setPlatform} options={PLATFORMS} />
            <FilterSelect icon={<IconDoc />} label="Search scope" value={scope} onChange={setScope} options={SCOPES} />
            <FilterSelect icon={<IconEdit />} label="Created" value={created} onChange={setCreated} options={PERIODS('Created')} />
            <FilterSelect icon={<IconCalendar />} label="Updated" value={updated} onChange={setUpdated} options={PERIODS('Updated')} />
        </div>
    )

    // ---------- Modal (o que você quer) ----------
    if (variant === 'modal') {
        if (!open) return null

        return (
            <div
                className="spOverlay"
                role="dialog"
                aria-modal="true"
                aria-label="Search games"
                onClick={(e) => {
                    // fecha se clicar no fundo escuro
                    if (e.target === e.currentTarget) onClose?.()
                }}
            >
                <form className="spModal" onSubmit={submit} role="search">
                    <div className="spModalTop">
                        <input
                            ref={inputRef}
                            type="search"
                            placeholder="Search..."
                            aria-label="Search games"
                            autoComplete="off"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="spSubmit">
                            Search
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="spModalClose"
                            aria-label="Close search"
                            onClick={onClose}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {filters}
                </form>
            </div>
        )
    }

    // ---------- Variante "page" (página de resultados) — opcional ----------
    if (variant === 'page') {
        return (
            <form className="spPage" onSubmit={submit} role="search">
                <div className="spPageRow">
                    <svg className="spBigIcon" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="21" y2="21" />
                    </svg>
                    <div className="spPageField">
                        <input
                            type="search"
                            aria-label="Search games"
                            autoComplete="off"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="spSubmit">
                            Search Again
                        </button>
                    </div>
                </div>

                <div className="spPageHelp">
                    <div className="spQuick">
                        <p>
                            <strong>Didn't find what you were looking for?</strong> Try filtering by:
                        </p>
                        {children}
                    </div>
                    <button
                        type="button"
                        className="spMore"
                        aria-expanded={showFilters}
                        onClick={() => setShowFilters((v) => !v)}
                    >
                        <span aria-hidden="true">{showFilters ? '−' : '+'}</span> More search options
                    </button>
                </div>

                {showFilters && filters}
            </form>
        )
    }

    return null
}

export default SearchPanel