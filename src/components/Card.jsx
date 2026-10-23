import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function Card({ game }) {
    const { lang } = useLanguage()

    return (
        <Link to={`/game/${lang}/${game.id}`} className="card">
            <div className="cardCover">
                <img src={game.cover} alt={game.title} loading="lazy" />
                {game.premium && <span className="premiumBadge">★ Premium</span>}
            </div>

            <div className="cardBody">
                <h1 className="cardTitle">{game.title} - {game.language}</h1>
            </div>
        </Link>
    )
}

export default Card
