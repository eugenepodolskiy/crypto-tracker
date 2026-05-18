import { Request, Response, NextFunction } from 'express'

// Logs every request - like Spring's request logging
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()

    // Called when response is finished
    res.on('finish', () => {
        const duration = Date.now() - start
        console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`)
    })

    next()
}

// Blocks requests for invalid coin IDs
const VALID_COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple']

export function validateCoinId(req: Request, res: Response, next: NextFunction): void {
    const coinId = req.params.coinId as string

    if (!VALID_COINS.includes(coinId)) {
        res.status(400).json({ error: `Invalid coin: ${coinId}` })
        return
    }

    next()
}