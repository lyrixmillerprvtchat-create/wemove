export const COINS = [
  { id: 'tether', symbol: 'USDT (TRC20)', network: 'TRC20', coingecko: 'tether' },
  { id: 'tether-erc20', symbol: 'USDT (ERC20)', network: 'ERC20', coingecko: 'tether' },
  { id: 'bitcoin', symbol: 'BTC', network: 'Bitcoin', coingecko: 'bitcoin' },
  { id: 'ethereum', symbol: 'ETH', network: 'Ethereum', coingecko: 'ethereum' },
  { id: 'binancecoin', symbol: 'BNB', network: 'BNB Chain', coingecko: 'binancecoin' },
]

export async function getCryptoPricesUSD(): Promise<Record<string, number>> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,ethereum,binancecoin&vs_currencies=usd',
    { next: { revalidate: 60 } }
  )
  if (!res.ok) return { tether: 1, bitcoin: 65000, ethereum: 3500, binancecoin: 600 }
  const data = await res.json()
  return {
    tether: data.tether?.usd ?? 1,
    bitcoin: data.bitcoin?.usd ?? 65000,
    ethereum: data.ethereum?.usd ?? 3500,
    binancecoin: data.binancecoin?.usd ?? 600,
  }
}

export async function getFiatRate(currency: string): Promise<number> {
  if (currency === 'USD') return 1
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return 1
    const data = await res.json()
    return data.rates?.[currency] ?? 1
  } catch {
    return 1
  }
}

export function coinGeckoKey(coinId: string): string {
  if (coinId === 'tether-erc20') return 'tether'
  return coinId
}
