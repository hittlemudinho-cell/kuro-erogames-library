// src/utils/searchGames.js

export const normalize = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

const SCORE = {
    titleStart: 100,
    tagExact: 90,
    tagStart: 70,
    titleIncludes: 60,
    tagIncludes: 50,
    meta: 20,
    synops: 10,
}

// Períodos dos filtros "Created" / "Updated"
const PERIOD_DAYS = { day: 1, week: 7, month: 30, year: 365 }

// Campos de data esperados no objeto do jogo: createdAt e updatedAt
// (ISO string ou timestamp). Ajuste os nomes aqui se na sua API forem outros.
const toTime = (v) => {
    const t = new Date(v).getTime()
    return Number.isNaN(t) ? 0 : t
}

const inPeriod = (value, period) => {
    if (!period) return true
    const days = PERIOD_DAYS[period]
    if (!days) return true
    const t = toTime(value)
    if (!t) return false
    return Date.now() - t <= days * 24 * 60 * 60 * 1000
}

const matchesPlatform = (game, platform) => {
    if (!platform) return true
    const p = normalize(platform)
    return toArray(game.os).some((o) => normalize(o).includes(p))
}

/**
 * Busca jogos.
 *
 * options:
 *  - limit:    máximo de resultados (default 20)
 *  - scope:    'all' (título, tags, autor, sinopse...) | 'title' (só título)
 *  - platform: '' | 'pc' | 'android'
 *  - created / updated: '' | 'day' | 'week' | 'month' | 'year'
 *  - sort:     'relevance' (default) | 'title' | 'newest' | 'updated'
 *
 * Retorna [{ game, score, matchedTags }].
 */
export function searchGames(
    games,
    query,
    {
        limit = 20,
        scope = 'all',
        platform = '',
        created = '',
        updated = '',
        sort = 'relevance',
    } = {}
) {
    const terms = normalize(query)
        .split(/\s+/)
        .map((t) => {
            const tagOnly = t.startsWith('#')
            return { text: tagOnly ? t.slice(1) : t, tagOnly }
        })
        .filter((t) => t.text)

    if (!terms.length || !Array.isArray(games)) return []

    const titleOnly = scope === 'title'
    const results = []

    for (const game of games) {
        // Filtros primeiro (mais barato que pontuar)
        if (!matchesPlatform(game, platform)) continue
        if (!inPeriod(game.createdAt, created)) continue
        if (!inPeriod(game.updatedAt, updated)) continue

        const title = normalize(game.title)
        const rawTags = toArray(game.tags)
            .map((t) => String(t).trim())
            .filter(Boolean)
        const tags = rawTags.map(normalize)
        const meta = [
            game.developer,
            game.author,
            game.language,
            ...toArray(game.os),
        ].map(normalize)
        const synops = normalize(game.synops)

        let total = 0
        let matches = true
        const matchedTags = new Set()

        for (const { text, tagOnly } of terms) {
            let best = 0

            if (!tagOnly) {
                if (title.startsWith(text)) best = SCORE.titleStart
                else if (title.includes(text)) best = SCORE.titleIncludes
            }

            if (!titleOnly || tagOnly) {
                tags.forEach((tag, i) => {
                    let s = 0
                    if (tag === text) s = SCORE.tagExact
                    else if (tag.startsWith(text)) s = SCORE.tagStart
                    else if (tag.includes(text)) s = SCORE.tagIncludes
                    if (s) {
                        matchedTags.add(rawTags[i])
                        best = Math.max(best, s)
                    }
                })
            }

            if (!tagOnly && !titleOnly) {
                if (meta.some((m) => m.includes(text)))
                    best = Math.max(best, SCORE.meta)
                if (synops.includes(text)) best = Math.max(best, SCORE.synops)
            }

            if (!best) {
                matches = false
                break
            }
            total += best
        }

        if (matches) {
            results.push({ game, score: total, matchedTags: [...matchedTags] })
        }
    }

    const byTitle = (a, b) => a.game.title.localeCompare(b.game.title)

    results.sort((a, b) => {
        if (sort === 'title') return byTitle(a, b)
        if (sort === 'newest')
            return toTime(b.game.createdAt) - toTime(a.game.createdAt) || byTitle(a, b)
        if (sort === 'updated')
            return toTime(b.game.updatedAt) - toTime(a.game.updatedAt) || byTitle(a, b)
        return b.score - a.score || byTitle(a, b)
    })

    return results.slice(0, limit)
}