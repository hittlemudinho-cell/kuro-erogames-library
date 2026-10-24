import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import GameDetail from './components/GameDetail'
import Header from './components/Header'
import Category from './components/Category'
import Guides from './components/Guides'
import SearchResults from './components/SearchResults'
import AgeGate from './components/AgeGate'
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* Aviso +18: aparece por cima de qualquer página até o usuário confirmar */}
      <AgeGate />

      <Routes>
        <Analytics/>
        {/* Rota principal: HomePage (que já carrega o Header e os GamesRecentes) */}
        <Route path="/" element={<HomePage />} />

        {/* Erros de login vindos do backend (/login?error=...) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Resultados da pesquisa (com o Header para poder pesquisar de novo) */}
        <Route
          path="/busca"
          element={
            <>
              <Header />
              <SearchResults />
            </>
          }
        />

        <Route
          path="/category/:platform"
          element={
            <>
              <Header />
              <Category />
            </>
          }
        />

        {/* Guides (com o Header para manter menu e login) */}
        <Route
          path="/guias"
          element={
            <>
              <Header />
              <Guides />
            </>
          }
        />

        {/* Rota dinâmica de detalhes do jogo (agora com Header, para ter o login) */}
        <Route
          path="/game/:lang/:id"
          element={
            <>
              <Header />
              <GameDetail />
            </>
          }
        />
      </Routes>
    </>
  )
}

export default App