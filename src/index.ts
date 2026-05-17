import express from 'express'
import { getCurrentPrices, getCoinChart } from './crypto'
import { getCachedPrices, setCachedPrices, getCachedChart, setCachedChart } from './db'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static('public'))

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/prices', async (req, res) => {
    try {
        // Check cache first - if data is fresh, return it without calling CoinGecko
        const cached = getCachedPrices()
        if (cached) {
            console.log('Prices: returning from cache')
            return res.json(cached)
        }

        // Cache miss - fetch from CoinGecko and store
        console.log('Prices: fetching from CoinGecko')
        const prices = await getCurrentPrices()
        setCachedPrices(prices)
        res.json(prices)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch prices' })
    }
})

app.get('/api/chart/:coinId', async (req, res) => {
    const { coinId } = req.params

    try {
        // Check cache first
        const cached = getCachedChart(coinId)
        if (cached) {
            console.log(`Chart ${coinId}: returning from cache`)
            return res.json(cached)
        }

        // Cache miss - fetch from CoinGecko and store
        console.log(`Chart ${coinId}: fetching from CoinGecko`)
        const chart = await getCoinChart(coinId)
        setCachedChart(coinId, chart)
        res.json(chart)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chart data' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})