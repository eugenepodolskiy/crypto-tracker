# Crypto Tracker

A full-stack application for tracking real-time prices and 7-day charts for the top 5 cryptocurrencies. Built with Node.js, TypeScript, and Express on the backend, vanilla JavaScript on the frontend.

## Tech Stack

- Node.js + TypeScript
- Express
- SQLite (price and chart caching)
- Chart.js (frontend charts)
- CoinGecko API (market data)
- Jest (testing)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

- Live prices for BTC, ETH, BNB, XRP, SOL
- 24h price change indicator (green/red)
- 7-day interactive price chart per coin
- SQLite caching layer to avoid CoinGecko rate limits
  - Prices cached for 1 minute
  - Charts cached for 1 hour

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/prices | Current prices for all 5 coins |
| GET | /api/chart/:coinId | 7-day chart data for a specific coin |
| GET | /api/health | Server health check |

## Running Tests

```bash
npm test
```