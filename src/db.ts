import Database from 'better-sqlite3'

const db = new Database('cache.db')

// Create cache table on startup
db.exec(`
    CREATE TABLE IF NOT EXISTS price_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chart_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
    );
`)

const PRICE_TTL = 60 * 1000        // 1 minute
const CHART_TTL = 60 * 60 * 1000   // 1 hour

export function getCachedPrices(): any[] | null {
    const row = db.prepare(
        'SELECT data, updated_at FROM price_cache WHERE id = ?'
    ).get('all') as { data: string, updated_at: number } | undefined

    if (!row) return null

    const isExpired = Date.now() - row.updated_at > PRICE_TTL
    if (isExpired) return null

    return JSON.parse(row.data)
}

export function setCachedPrices(data: any[]): void {
    db.prepare(`
        INSERT OR REPLACE INTO price_cache (id, data, updated_at)
        VALUES (?, ?, ?)
    `).run('all', JSON.stringify(data), Date.now())
}

export function getCachedChart(coinId: string): any | null {
    const row = db.prepare(
        'SELECT data, updated_at FROM chart_cache WHERE id = ?'
    ).get(coinId) as { data: string, updated_at: number } | undefined

    if (!row) return null

    const isExpired = Date.now() - row.updated_at > CHART_TTL
    if (isExpired) return null

    return JSON.parse(row.data)
}

export function setCachedChart(coinId: string, data: any): void {
    db.prepare(`
        INSERT OR REPLACE INTO chart_cache (id, data, updated_at)
        VALUES (?, ?, ?)
    `).run(coinId, JSON.stringify(data), Date.now())
}