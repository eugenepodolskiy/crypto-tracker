const COINS = [
    { id: 'bitcoin', symbol: 'BTC' },
    { id: 'ethereum', symbol: 'ETH' },
    { id: 'binancecoin', symbol: 'BNB' },
    { id: 'ripple', symbol: 'XRP' },
    { id: 'solana', symbol: 'SOL' }
]

let chart = null
let activeCoin = 'bitcoin'

// Fetch prices and render cards
async function loadPrices() {
    const response = await fetch('/api/prices')
    const prices = await response.json()

    const cardsEl = document.getElementById('cards')
    cardsEl.innerHTML = prices.map(coin => `
        <div class="card ${coin.id === activeCoin ? 'active' : ''}" 
             onclick="loadChart('${coin.id}')">
            <div class="card-name">${coin.symbol.toUpperCase()}</div>
            <div class="card-price">$${coin.current_price.toLocaleString()}</div>
            <div class="card-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
            </div>
        </div>
    `).join('')
}

// Render coin buttons
function renderButtons() {
    const buttonsEl = document.getElementById('coin-buttons')
    buttonsEl.innerHTML = COINS.map(coin => `
        <button class="coin-btn ${coin.id === activeCoin ? 'active' : ''}"
                onclick="loadChart('${coin.id}')">
            ${coin.symbol}
        </button>
    `).join('')
}

// Fetch chart data and render
async function loadChart(coinId) {
    activeCoin = coinId

    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'))
    document.querySelectorAll('.coin-btn').forEach(btn => btn.classList.remove('active'))

    const activeCard = [...document.querySelectorAll('.card')]
        .find(card => card.onclick.toString().includes(coinId))
    if (activeCard) activeCard.classList.add('active')

    const activeBtn = [...document.querySelectorAll('.coin-btn')]
        .find(btn => btn.onclick.toString().includes(coinId))
    if (activeBtn) activeBtn.classList.add('active')

    try {
        const response = await fetch(`/api/chart/${coinId}`)
        const data = await response.json()

        const labels = data.prices.map(([timestamp]) =>
            new Date(timestamp).toLocaleDateString()
        )
        const prices = data.prices.map(([, price]) => price)

        if (chart) chart.destroy()

        const ctx = document.getElementById('chart').getContext('2d')
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: coinId,
                    data: prices,
                    borderColor: '#58a6ff',
                    backgroundColor: 'rgba(88, 166, 255, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: '#8b949e' },
                        grid: { color: '#21262d' }
                    },
                    y: {
                        ticks: { color: '#8b949e' },
                        grid: { color: '#21262d' }
                    }
                }
            }
        })
    } catch (error) {
        console.error(`Failed to load chart for ${coinId}:`, error)
    }
}

// Init
async function init() {
    try {
        await loadPrices()
        renderButtons()
        await loadChart(activeCoin)
    } catch (error) {
        document.getElementById('cards').innerHTML = `
            <div style="color: #f85149; grid-column: 1/-1;">
                Failed to load data. Please try again later.
            </div>
        `
    }
}
init()