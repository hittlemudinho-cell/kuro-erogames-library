// src/components/SearchResults.jsx
import React, { useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Card from './Card'
import GamesStatus from './GamesStatus'
import SearchPanel from './SearchPanel'
import '../globalcss/style.css'
import { useGames } from '../context/GamesContext'
import { searchGames } from '../utils/searchGames'

const PAGE_SIZE = 12

const SORTS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest first' },
    { value: 'updated', label: 'Recently updated' },
    { value: 'title', label: 'Title (A–Z)' },
]

// Gera a lista de páginas visíveis: 1 2 3 4 5 … N
function pageWindow(current, total, size = 6) {
    let start = Math.max(1, current - Math.floor(size / 2))
    let end = start + size - 1
    if (end > total) {
        end = total
        start = Math.max(1, end - size + 1)
    }
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
}

function SearchResults() {
    const { games, loading, error } = useGames()
    const [params, setParams] = useSearchParams()

    const query = (params.get('q') || '').trim()
    const platform = params.get('platform') || ''
    const scope = params.get('scope') || 'all'
    const created = params.get('created') || ''
    const updated = params.get('updated') || ''
    const sort = params.get('sort') || 'relevance'
    const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1)

    const all = useMemo(
        () =>
            searchGames(games, query, {
                limit: Infinity,
                scope,
                platform,
                created,
                updated,
                sort,
            }),
        [games, query, scope, platform, created, updated, sort]
    )

    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE))
    const current = Math.min(page, totalPages)
    const visible = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    // Sobe ao topo quando a página muda
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [current, query])

    // Atualiza só alguns parâmetros mantendo o resto
    const update = (changes) => {
        const next = new URLSearchParams(params)
        Object.entries(changes).forEach(([k, v]) => {
            if (v === '' || v == null) next.delete(k)
            else next.set(k, v)
        })
        setParams(next)
    }

    const goPage = (n) => update({ page: n === 1 ? '' : String(n) })

    // Resumo dos filtros ativos para o subtítulo
    const activeFilters = [
        platform && (platform === 'pc' ? 'PC' : 'Android'),
        scope === 'title' && 'titles only',
        created && `created in the last ${created}`,
        updated && `updated in the last ${updated}`,
    ].filter(Boolean)

    const hasResults = !loading && !error && query && all.length > 0

    return (
        <div className="srPage">
            <nav className="srCrumbs" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden="true">›</span>
                <span>Search</span>
            </nav>

            <h1 className="srTitle">Search</h1>
            <p className="srSub">
                {query
                    ? `Showing results for '${query}'${activeFilters.length ? ` (${activeFilters.join(', ')})` : ''}.`
                    : 'Type something to search.'}
            </p>

            <SearchPanel variant="page">
                <div className="spQuickLinks">
                    <button type="button" onClick={() => update({ sort: 'newest', page: '' })}>
                        Newest first
                    </button>
                    {query && scope !== 'title' && (
                        <button type="button" onClick={() => update({ scope: 'title', page: '' })}>
                            {query} only in title
                        </button>
                    )}
                </div>
            </SearchPanel>

            <GamesStatus />

            {query && !loading && !error && (
                <section className="srResults">
                    <h2 className="srFound">
                        Found {all.length} {all.length === 1 ? 'result' : 'results'}
                    </h2>

                    {hasResults && (
                        <div className="srBar">
                            <div className="srPager" role="navigation" aria-label="Pagination">
                                {pageWindow(current, totalPages).map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        className={n === current ? 'active' : ''}
                                        aria-current={n === current ? 'page' : undefined}
                                        onClick={() => goPage(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                                {current < totalPages && (
                                    <>
                                        <button type="button" className="wide" onClick={() => goPage(current + 1)}>
                                            NEXT
                                        </button>
                                        <button type="button" aria-label="Last page" onClick={() => goPage(totalPages)}>
                                            »
                                        </button>
                                    </>
                                )}
                                <span className="srPageOf">
                                    PAGE {current} OF {totalPages}
                                </span>
                            </div>

                            <label className="srSort">
                                ORDER BY
                                <select
                                    value={sort}
                                    onChange={(e) => update({ sort: e.target.value === 'relevance' ? '' : e.target.value, page: '' })}
                                >
                                    {SORTS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    )}

                    {all.length === 0 && (
                        <div className="notFound srEmpty">
                            <h2>No games found.</h2>
                            <p>Try another name, a part of a tag, or remove some filters.</p>
                            <Link to="/">Back to home</Link>
                        </div>
                    )}

                    {hasResults && (
                        <div className="gamesRecentes">
                            {visible.map(({ game, matchedTags }) => (
                                <div className="searchItem" key={game.id}>
                                    {/* Card já leva para /game/:lang/:id (GameDetail) */}
                                    <Card game={game} />
                                    {matchedTags.length > 0 && (
                                        <ul className="searchItemTags">
                                            {matchedTags.map((tag) => (
                                                <li key={tag}>{tag}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {hasResults && totalPages > 1 && (
                        <div className="srBar srBarBottom">
                            <div className="srPager">
                                <button type="button" disabled={current === 1} onClick={() => goPage(current - 1)}>
                                    ‹
                                </button>
                                <span className="srPageOf">
                                    PAGE {current} OF {totalPages}
                                </span>
                                <button type="button" disabled={current === totalPages} onClick={() => goPage(current + 1)}>
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default SearchResults