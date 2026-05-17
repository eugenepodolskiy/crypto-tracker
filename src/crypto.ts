import axios from 'axios'

// The 5 coins we track
const COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple']

const COINGECKO_URL = 'https://api.coingecko.com/api/v3'

// Shape of the price data we get back from CoinGecko
interface CoinPrice {
    id: string
    symbol: string
    name: string
    current_price: number
    price_change_percentage_24h: number
}

// Shape of the chart data
interface ChartData {
    prices: [number, number][]  // [timestamp, price]
}

export async function getCurrentPrices(): Promise<CoinPrice[]> {
    const response = await axios.get(`${COINGECKO_URL}/coins/markets`, {
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
        `${COINGECKO_URL}/coins/${coinId}/market_chart`,
        {
            params: {
                vs_currency: 'usd',
                days: 7  // last 7 days
            }
        }
    )
    return response.data
}