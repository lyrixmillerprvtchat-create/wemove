'use client'
import { useState } from 'react'
import Link from 'next/link'
import { COINS, getCryptoPricesUSD } from '@/lib/rates'

const BG = 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)'
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#f1f5f9', padding: '12px 16px', width: '100%', fontSize: 15, outline: 'none' }
const LABEL: React.CSSProperties = { color: '#94a3b8', fontSize: 13, marginBottom: 6, display: 'block', fontWeight: 600 }

export default function CreatePage() {
  const [coin, setCoin] = useState(COINS[0])
  const [wallet, setWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [usdPrice, setUsdPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const amountNum = parseFloat(amount) || 0
  const usdValue = usdPrice ? amountNum * usdPrice : null

  async function fetchPrice(coinId: string) {
    const prices = await getCryptoPricesUSD()
    const key = coinId === 'tether-erc20' ? 'tether' : coinId
    setUsdPrice(prices[key] ?? null)
  }

  function onCoinChange(coinId: string) {
    const c = COINS.find(x => x.id === coinId) ?? COINS[0]
    setCoin(c)
    fetchPrice(c.coingecko)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!wallet.trim()) { setError('Please enter your wallet address.'); return }
    if (!amountNum || amountNum <= 0) { setError('Please enter a valid amount.'); return }

    setLoading(true)
    try {
      const prices = await getCryptoPricesUSD()
      const key = coin.coingecko
      const usd = amountNum * (prices[key] ?? 1)

      const res = await fetch('/api/create-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin_id: coin.id, coin_symbol: coin.symbol, network: coin.network, wallet_address: wallet.trim(), amount_crypto: amountNum, amount_usd: usd, note }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const link = `${window.location.origin}/pay/${data.id}`
      setGeneratedLink(link)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          WeMove
        </Link>
        <span style={{ color: '#64748b', fontSize: 14 }}>Create Payment Link</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Create your payment link</h1>
        <p className="mb-8" style={{ color: '#64748b', fontSize: 14 }}>Enter your crypto details. Share the link with anyone worldwide.</p>

        {generatedLink ? (
          <div style={CARD} className="p-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Your payment link is ready!</h2>
            <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>Share this link with your payer. They'll see the amount in their local currency and can pay using their preferred method.</p>
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }} className="p-4 mb-4 break-all text-sm">
              <span style={{ color: '#a5b4fc', wordBreak: 'break-all' }}>{generatedLink}</span>
            </div>
            <button onClick={copyLink}
              style={{ background: copied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, border: 'none', cursor: 'pointer' }}
              className="w-full py-3 text-white font-semibold mb-4">
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
            <button onClick={() => { setGeneratedLink(''); setWallet(''); setAmount(''); setNote('') }}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer' }}
              className="w-full py-3 text-sm">
              Create another link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={CARD} className="p-6 flex flex-col gap-5">
            {/* Coin selector */}
            <div>
              <label style={LABEL}>Select coin to receive</label>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))' }}>
                {COINS.map(c => (
                  <button type="button" key={c.id} onClick={() => onCoinChange(c.id)}
                    style={{
                      borderRadius: 10, border: coin.id === c.id ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      background: coin.id === c.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                      padding: '10px 8px', cursor: 'pointer', transition: 'all 0.15s'
                    }}>
                    <div className="text-xs font-bold" style={{ color: coin.id === c.id ? '#a5b4fc' : '#94a3b8' }}>{c.symbol.split(' ')[0]}</div>
                    <div className="text-xs mt-1" style={{ color: '#475569', fontSize: 10 }}>{c.network}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet */}
            <div>
              <label style={LABEL}>Your {coin.network} wallet address</label>
              <input style={INPUT} placeholder={`Enter your ${coin.network} address`} value={wallet} onChange={e => setWallet(e.target.value)} />
            </div>

            {/* Amount */}
            <div>
              <label style={LABEL}>Amount to receive ({coin.symbol.split(' ')[0]})</label>
              <input style={INPUT} type="number" step="any" min="0" placeholder="0.00" value={amount}
                onChange={e => { setAmount(e.target.value); if (usdPrice === null) fetchPrice(coin.coingecko) }} />
              {usdValue !== null && amountNum > 0 && (
                <div className="mt-2 text-xs" style={{ color: '#6366f1' }}>≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
              )}
            </div>

            {/* Note */}
            <div>
              <label style={LABEL}>Note (optional)</label>
              <input style={INPUT} placeholder="e.g. Payment for invoice #1234" value={note} onChange={e => setNote(e.target.value)} />
            </div>

            {error && <div style={{ color: '#f87171', fontSize: 13, background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}

            <button type="submit" disabled={loading}
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              className="py-4 text-white font-bold text-base mt-1">
              {loading ? 'Generating...' : 'Generate Payment Link →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
