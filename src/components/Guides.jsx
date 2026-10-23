import React from 'react'
import { Link } from 'react-router-dom'
import '../globalcss/Guides.css'

// Troque pelo link de convite real do seu servidor
const DISCORD_URL = 'https://discord.gg/SEU-CONVITE'

function Guides() {
    return (
        <main className="guidesPage">
            {/* Breadcrumb */}
            <nav className="guidesCrumbs" aria-label="Breadcrumb">
                <Link to="/" className="guidesCrumbHome">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z" />
                    </svg>
                    Home
                </Link>
                <svg
                    className="guidesCrumbSep"
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
                    <path d="m9 6 6 6-6 6" />
                </svg>
                <span aria-current="page">Guides</span>
            </nav>

            {/* Card */}
            <article className="guidesCard">
                <header className="guidesCardHead">
                    <h1>Guides</h1>
                </header>

                <div className="guidesCardBody">
                    <h2>Welcome to Kuro</h2>
                    <p>
                        <strong>Kuro Erogames Library</strong> is a website dedicated to
                        sharing games in three languages: <strong>English</strong>,{' '}
                        <strong>Spanish</strong> and <strong>Portuguese</strong>. Our goal
                        is to make it easy for you to find and enjoy games in the language
                        you feel most comfortable with.
                    </p>

                    <h2>A Library, Not a Store</h2>
                    <p>
                        Think of Kuro as a library. Just like you would walk into a
                        library, browse the shelves and take any book you like, here you
                        can come in, explore the collection and download whatever you want,
                        as much as you want. There are no limits on curiosity: pick a
                        title, enjoy it, and come back whenever you feel like discovering
                        something new.
                    </p>

                    <h2>About the Translations</h2>
                    <p>
                        Many of the games available here were translated by us. However,
                        some translations were made by <strong>other developers and
                        translation teams</strong>. Whenever that is the case, the credit
                        belongs to them, and we simply gather their work in one place so
                        it is easier for everyone to find.
                    </p>

                    <h2>Supported Languages</h2>
                    <p>Translation support is offered <strong>only</strong> for:</p>
                    <ul>
                        <li>
                            <strong>English</strong>
                        </li>
                        <li>
                            <strong>Spanish</strong>
                        </li>
                        <li>
                            <strong>Portuguese</strong>
                        </li>
                    </ul>
                    <p>
                        Requests for any other language are not supported at the moment.
                    </p>

                    <h2>Adults Only (18+)</h2>
                    <p>
                        Kuro is a site dedicated <strong>entirely to adults (+18)</strong>.
                        The content published here is intended exclusively for this
                        audience. By browsing the site or creating an account, you confirm
                        that you are of legal age.
                    </p>

                    <h2>Game Suggestions</h2>
                    <p>
                        Want to see a specific game in the library? Join our Discord and
                        leave your suggestion there. I will personally be translating the
                        games and bringing them to all of us, so your suggestions go
                        straight to the person doing the work.
                    </p>
                    <a
                        className="guidesDiscordBtn"
                        href={DISCORD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Join our Discord
                    </a>
                </div>
            </article>
        </main>
    )
}

export default Guides