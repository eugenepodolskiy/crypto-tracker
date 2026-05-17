import { getCachedPrices, setCachedPrices, getCachedChart, setCachedChart } from './db'

describe('Cache - prices', () => {

    it('should return null when cache is empty', () => {
        const result = getCachedPrices()
        expect(result).toBeNull()
    })

    it('should return cached prices after storing them', () => {
        const mockPrices = [
            { id: 'bitcoin', symbol: 'btc', current_price: 78000 },
            { id: 'ethereum', symbol: 'eth', current_price: 2200 }
        ]

        setCachedPrices(mockPrices)
        const result = getCachedPrices()

        expect(result).not.toBeNull()
        expect(result).toHaveLength(2)
        expect(result![0].id).toBe('bitcoin')
        expect(result![1].current_price).toBe(2200)
    })
})

describe('Cache - charts', () => {

    it('should return null when chart cache is empty', () => {
        const result = getCachedChart('dogecoin')
        expect(result).toBeNull()
    })

    it('should return cached chart after storing it', () => {
        const mockChart = {
            prices: [
                [1699000000000, 78000],
                [1699100000000, 79000]
            ]
        }

        setCachedChart('bitcoin', mockChart)
        const result = getCachedChart('bitcoin')

        expect(result).not.toBeNull()
        expect(result.prices).toHaveLength(2)
        expect(result.prices[0][1]).toBe(78000)
    })

    it('should cache different coins independently', () => {
        const btcChart = { prices: [[1699000000000, 78000]] }
        const ethChart = { prices: [[1699000000000, 2200]] }

        setCachedChart('bitcoin', btcChart)
        setCachedChart('ethereum', ethChart)

        expect(getCachedChart('bitcoin').prices[0][1]).toBe(78000)
        expect(getCachedChart('ethereum').prices[0][1]).toBe(2200)
    })
})