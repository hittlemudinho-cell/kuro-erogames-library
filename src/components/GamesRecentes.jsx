import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from './Card'
import GamesStatus from './GamesStatus'
import '../globalcss/style.css'
import { useGames } from '../context/GamesContext'

function GamesRecentes() {
    const { games } = useGames()
    const [searchParams, setSearchParams] = useSearchParams()

    const gamesPerPage = 6
    const totalPages = Math.max(1, Math.ceil(games.length / gamesPerPage))

    // Página atual vinda da URL (?page=2), sempre dentro do intervalo válido
    const requestedPage = parseInt(searchParams.get('page') || '1', 10)
    const currentPage = Math.min(
        Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1),
        totalPages
    )

    const start = (currentPage - 1) * gamesPerPage
    const currentGames = games.slice(start, start + gamesPerPage)

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <section className="gamesRecentesWrapper">
            <GamesStatus />

            <div className="gamesRecentes">
                {currentGames.map((game) => (
                    <Card key={game.id} game={game} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                style={{
                                    fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
                                    background: currentPage === pageNumber ? '#ccc' : 'transparent'
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

export default GamesRecentes
