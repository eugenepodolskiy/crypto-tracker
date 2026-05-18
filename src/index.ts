import express from 'express'
import { getCurrentPrices, getCoinChart } from './crypto'
import { getCachedPrices, setCachedPrices, getCachedChart, setCachedChart } from './db'
import { requestLogger, validateCoinId } from './middleware'
import { config } from './config'

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(requestLogger)

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/prices', async (req, res) => {
    try {
        const cached = getCachedPrices()
        if (cached) {
            console.log('Prices: returning from cache')
            return res.json(cached)
        }

        console.log('Prices: fetching from CoinGecko')
        const prices = await getCurrentPrices()
        setCachedPrices(prices)
        res.json(prices)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch prices' })
    }
})

app.get('/api/chart/:coinId',validateCoinId, async (req, res) => {
    const coinId = req.params.coinId as string

    try {
        const cached = getCachedChart(coinId)
        if (cached) {
            console.log(`Chart ${coinId}: returning from cache`)
            return res.json(cached)
        }

        console.log(`Chart ${coinId}: fetching from CoinGecko`)
        const chart = await getCoinChart(coinId)
        setCachedChart(coinId, chart)
        res.json(chart)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chart data' })
    }
})

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`)
})