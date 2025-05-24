# Crypto Dashboard

A modern Next.js dashboard application for tracking and exploring cryptocurrency market data. Fetches real-time prices, top gainers/losers, newly listed assets, and allows you to manage a list of favorite coins.


## Tech Stack

**Framework:** Next.js (App Router)

**UI:** React

**HTTP Client:** Axios + axios-rate-limit

**API:** CoinGecko public API


## Features

- Real-time Data: Fetch current prices from the CoinGecko API.
- Rate-Limited API Calls: Prevent hitting API limits with axios-rate-limit.
- Authorization Forms: Complete user registration flow with user verification.
- Data Storage Structure: Established foundational data storage architecture (to be extended).
- Core Mechanics: Implemented primary logic for storing and managing cryptocurrency information.
- Interactive Portfolio: Interactive display of current assets in the user’s portfolio.
- General Info Component: Component for presenting categorized general information about cryptocurrencies.
- Responsive Design: Mobile-first, responsive UI that adapts to all screen sizes.


## Planned Features
These enhancements are on the roadmap for upcoming versions:

- Portfolio Dashboard: Manage and visualize your current crypto holdings in a unified dashboard view.

- Trend Analysis: Interactive charts to view historical price trends and performance metrics for selected assets.

- Price Alerts: Configure notifications for significant price drops or spikes in your portfolio or selected cryptocurrencies.

- News Feed: Display the latest news articles and updates related to the cryptocurrency market, sourced from public news APIs.

- Persistent Favorites: Save user favorites to backend service to retain preferences across sessions.
## Run Locally

Clone the project

```bash
    git clone https://github.com/Jobdik/crypto-dashboard.git
    cd crypto-dashboard
```
Install dependencies:
```bash
    npm install
    # or
    yarn
```



Environment Variables:
Create a .env.local file in the project root to override the default API URL if needed:

```bash
    NEXT_PUBLIC_API_URL=https://api.coingecko.com/api/v3
```

Running Locally
```bash
    npm run dev
    # or
    yarn dev
```

## Authors

- [@Jobdik](https://github.com/Jobdik)
