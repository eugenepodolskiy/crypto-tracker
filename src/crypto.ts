import axios from 'axios'
import { config } from './config'

const COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple']

interface CoinPrice {
    id: string
    symbol: string
    name: string
    current_price: number
    price_change_percentage_24h: number
}

interface ChartData {
    prices: [number, number][]
}

export async function getCurrentPrices(): Promise<CoinPrice[]> {
    const response = await axios.get(`${config.coingeckoUrl}/coins/markets`, {
        params: {
            vs_currency: 'usd',
            ids: COINS.join(','),
            order: 'market_cap_desc'
        }
    })
    return response.data
}

export async function getCoinChart(coinId: string): Promise<ChartData> {
    const response = await axios.get(
        `${config.coingeckoUrl}/coins/${coinId}/market_chart`,
        {
            params: {
                vs_currency: 'usd',
                days: 7
            }
        }
    )
    return response.data
}