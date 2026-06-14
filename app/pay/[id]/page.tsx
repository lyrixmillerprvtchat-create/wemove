'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { COUNTRIES, METHOD_LABELS, METHOD_ICONS, type Country, type PaymentMethod } from '@/lib/countries'

const BG = 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)'
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }
const SELECT_STYLE: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#f1f5f9', padding: '12px 16px', width: '100%', fontSize: 15, outline: 'none' }

interface PaymentRequest {
  id: string
  coin_symbol: string
  network: string
  wallet_address: string
  amount_crypto: number
  amount_usd: number
  note: string | null
}

export default function PayPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<PaymentRequest | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [country, setCountry] = useState<Country | null>(null)
  const [fiatAmount, setFiatAmount] = useState<string>('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [loadingRates, setLoadingRates] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/request/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setRequest(d); else setNotFound(true) })
      .catch(() => setNotFound(true))
  }, [id])

  async function onCountryChange(code: string) {
    const c = COUNTRIES.find(x => x.code === code) ?? null
    setCountry(c)
    setSelectedMethod(null)
    setFiatAmount('')
    if (!c || !request) return
    setLoadingRates(true)
    try {
      const res = await fetch(`/api/rates?currency=${c.currency}`)
      const data = await res.json()
      const localAmount = request.amount_usd * data.fiatRate
      setFiatAmount(localAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    } catch { setFiatAmount('—') }
    finally { setLoadingRates(false) }
  }

  async function onSelectMethod(method: PaymentMethod) {
    setSelectedMethod(method)
    if (method === 'crypto' && request) {
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(request.wallet_address, { width: 220, margin: 2, color: { dark: '#1e1b4b', light: '#eef2ff' } })
      setQrDataUrl(url)
    }
  }

  function copyAddress() {
    if (!request) return
    navigator.clipboard.writeText(request.wallet_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (notFound) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={CARD} className="p-10 text-center max-w-sm mx-4">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Link not found</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>This payment link may have expired or doesn&apos;t exist.</p>
      </div>
    </div>
  )

  if (!request) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span style={{ color: '#64748b', fontSize: 14 }}>Loading payment...</span>
      </div>
    </div>
  )

  const coinName = request.coin_symbol.split(' ')[0]

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-4 max-w-xl mx-auto">
        <span className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          WeMove
        </span>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-10 flex flex-col gap-5">
        {/* Request summary */}
        <div style={CARD} className="p-6">
          <div className="text-xs font-semibold mb-1" style={{ color: '#6366f1' }}>PAYMENT REQUEST</div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-extrabold" style={{ color: '#f1f5f9' }}>{request.amount_crypto}</span>
            <span className="text-xl font-bold" style={{ color: '#a5b4fc' }}>{coinName}</span>
          </div>
          <div className="text-sm mb-3" style={{ color: '#64748b' }}>≈ ${request.amount_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD · {request.network} network</div>
          {request.note && <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc' }}>📝 {request.note}</div>}
        </div>

        {/* Step 1: Country */}
        <div style={CARD} className="p-6">
          <div className="text-xs font-bold mb-3" style={{ color: '#6366f1' }}>STEP 1 — YOUR COUNTRY</div>
          <label className="block text-sm mb-2" style={{ color: '#94a3b8' }}>Select your country to see the amount in your currency</label>
          <select style={SELECT_STYLE} onChange={e => onCountryChange(e.target.value)} defaultValue="">
            <option value="" disabled>— Choose your country —</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          {country && (
            <div className="mt-4 p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>You need to send</div>
                {loadingRates
                  ? <div className="text-lg font-bold mt-0.5" style={{ color: '#f1f5f9' }}>Calculating...</div>
                  : <div className="text-2xl font-extrabold mt-0.5" style={{ color: '#f1f5f9' }}>{country.symbol}{fiatAmount} <span className="text-base font-normal" style={{ color: '#94a3b8' }}>{country.currency}</span></div>
                }
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: '#94a3b8' }}>Receiver gets</div>
                <div className="text-lg font-bold mt-0.5" style={{ color: '#a5b4fc' }}>{request.amount_crypto} {coinName}</div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Payment method */}
        {country && (
          <div style={CARD} className="p-6">
            <div className="text-xs font-bold mb-3" style={{ color: '#6366f1' }}>STEP 2 — PAYMENT METHOD</div>
            <label className="block text-sm mb-3" style={{ color: '#94a3b8' }}>Choose how you want to pay</label>
            <div className="flex flex-col gap-3">
              {country.methods.map(method => (
                <button key={method} type="button" onClick={() => onSelectMethod(method)}
                  style={{
                    borderRadius: 12,
                    border: selectedMethod === method ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedMethod === method ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                  <span style={{ fontSize: 22 }}>{METHOD_ICONS[method]}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{METHOD_LABELS[method]}</div>
                    {method !== 'crypto' && <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Coming soon — integration in progress</div>}
                    {method === 'crypto' && <div className="text-xs mt-0.5" style={{ color: '#6366f1' }}>Send {coinName} directly to wallet address</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Payment instructions */}
        {selectedMethod === 'crypto' && (
          <div style={CARD} className="p-6 text-center">
            <div className="text-xs font-bold mb-3" style={{ color: '#6366f1' }}>STEP 3 — SEND CRYPTO</div>
            <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>Send exactly <strong style={{ color: '#f1f5f9' }}>{request.amount_crypto} {coinName}</strong> to this address on the <strong style={{ color: '#f1f5f9' }}>{request.network}</strong> network.</p>
            {qrDataUrl && (
              <div className="flex justify-center mb-4">
                <img src={qrDataUrl} alt="Wallet QR Code" style={{ borderRadius: 12 }} width={200} height={200} />
              </div>
            )}
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '12px 14px', wordBreak: 'break-all', fontSize: 13, color: '#a5b4fc', marginBottom: 12 }}>
              {request.wallet_address}
            </div>
            <button onClick={copyAddress}
              style={{ background: copied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', padding: '13px 0', fontWeight: 700, fontSize: 15, color: '#fff' }}>
              {copied ? '✓ Address Copied!' : 'Copy Wallet Address'}
            </button>
            <p className="text-xs mt-4" style={{ color: '#475569' }}>⚠️ Only send {coinName} on the {request.network} network. Sending wrong coin or network will result in loss of funds.</p>
          </div>
        )}

        {selectedMethod === 'stripe' && country && (
          <div style={CARD} className="p-6 text-center">
            <div className="text-xs font-bold mb-3" style={{ color: '#6366f1' }}>STEP 3 — PAY WITH CARD</div>
            <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
              You'll be redirected to Stripe's secure checkout to pay <strong style={{ color: '#f1f5f9' }}>{country.symbol}{fiatAmount} {country.currency}</strong>.
            </p>
            <button
              onClick={async () => {
                if (!request || !country) return
                setStripeLoading(true)
                try {
                  const localAmt = parseFloat(fiatAmount.replace(/,/g, ''))
                  const res = await fetch('/api/stripe-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount_usd: request.amount_usd, coin_symbol: request.coin_symbol, request_id: request.id, payer_country: country.name, currency: country.currency, fiat_amount: localAmt }),
                  })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                } catch { setStripeLoading(false) }
              }}
              disabled={stripeLoading}
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, border: 'none', cursor: stripeLoading ? 'not-allowed' : 'pointer', opacity: stripeLoading ? 0.7 : 1, width: '100%', padding: '14px 0', color: '#fff', fontWeight: 700, fontSize: 16 }}>
              {stripeLoading ? 'Redirecting...' : '💳 Pay with Card →'}
            </button>
            <p className="text-xs mt-3" style={{ color: '#475569' }}>Secured by Stripe · 256-bit SSL encryption</p>
          </div>
        )}

        {selectedMethod && selectedMethod !== 'crypto' && selectedMethod !== 'stripe' && (
          <div style={CARD} className="p-6 text-center">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#f1f5f9' }}>{METHOD_LABELS[selectedMethod]} — Coming Soon</h3>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              This payment method is being integrated. Please use <strong style={{ color: '#a5b4fc' }}>Pay with Crypto</strong> for now, or ask the payment creator to contact you with alternative arrangements.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
