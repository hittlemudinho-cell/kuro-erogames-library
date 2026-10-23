import React, { useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import Card from './Card'
import GamesStatus from './GamesStatus'
import '../globalcss/style.css'
import { useGames } from '../context/GamesContext'

// Plataformas aceitas na URL (/category/:platform).
// A chave é a mesma usada em game.download (pc, android).
const PLATFORMS = {
    pc: 'PC',
    android: 'Android',
}

const GAMES_PER_PAGE = 12

// Jogo premium bloqueado chega da API com download: null. Por isso, se a API enviar
// `platforms` (recomendado), usamos ele; senão caímos nas chaves do download.
const platformsOf = (game) => game.platforms ?? Object.keys(game.download ?? {})

function Category() {
    const { platform } = useParams()
    const { games: allGames, loading, error } = useGames()
    const [searchParams, setSearchParams] = useSearchParams()

    const platformKey = (platform || '').toLowerCase()
    const platformLabel = PLATFORMS[platformKey]

    const games = useMemo(() => {
        if (!platformLabel) return []
        return allGames.filter((game) => platformsOf(game).includes(platformKey))
    }, [allGames, platformKey, platformLabel])

    const totalPages = Math.max(1, Math.ceil(games.length / GAMES_PER_PAGE))
    const requestedPage = parseInt(searchParams.get('page') || '1', 10)
    const currentPage = Math.min(
        Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1),
        totalPages
    )

    const start = (currentPage - 1) * GAMES_PER_PAGE
    const currentGames = games.slice(start, start + GAMES_PER_PAGE)

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!platformLabel) {
        return (
            <div className="notFound">
                <h2>Platform not found!</h2>
                <Link to="/">Back to home</Link>
            </div>
        )
    }

    return (
        <section className="gamesRecentesWrapper searchPage">
            <header className="searchPageTop">
                <h2>Games for {platformLabel}</h2>
                {!loading && !error && (
                    <p>
                        {games.length}{' '}
                        {games.length === 1 ? 'Available game' : 'Available games'}
                    </p>
                )}
            </header>

            <GamesStatus />

            {!loading && !error && games.length === 0 && (
                <div className="notFound">
                    <h2>No games for {platformLabel} in this language.</h2>
                    <Link to="/">Back to home</Link>
                </div>
            )}

            {games.length > 0 && (
                <div className="gamesRecentes">
                    {currentGames.map((game) => (
                        <Card key={game.id} game={game} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div
                    className="pagination"
                    style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                style={{
                                    fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
                                    background: currentPage === pageNumber ? '#ccc' : 'transparent',
                                }}
                            >
                                {pageNumber}
                            </button>
                        )
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    )
}

export default Category
