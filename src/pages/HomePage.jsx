import React from 'react'
import Header from '../components/Header'
import GamesRecentes from '../components/GamesRecentes'

function HomePage() {
  return (
    <div>
        <Header/>

        {/* Cards à esquerda, ranking de mais vistos à direita */}
        <div className="homeLayout">
            <GamesRecentes/>
        </div>
    </div>
  )
}

export default HomePage