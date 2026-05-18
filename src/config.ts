import dotenv from 'dotenv'

dotenv.config()

// Central place for all config - like application.yml in Spring Boot
export const config = {
    port: Number(process.env.PORT) || 3000,
    coingeckoUrl: process.env.COINGECKO_URL || 'https://api.coingecko.com/api/v3',
    priceCacheTtl: Number(process.env.PRICE_CACHE_TTL) || 60000,
    chartCacheTtl: Number(process.env.CHART_CACHE_TTL) || 3600000
}