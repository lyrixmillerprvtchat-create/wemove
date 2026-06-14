'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const BG = 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)'
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }

export default function SuccessPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [request, setRequest] = useState<{ coin_symbol: string; amount_crypto: number } | null>(null)

  useEffect(() => {
    fetch(`/api/request/${id}`).then(r => r.json()).then(setRequest)
  }, [id])

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ ...CARD, maxWidth: 440, width: '100%', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✓</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Payment Sent!</h1>
        <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
          Your payment was processed successfully via Stripe.
          {request && <><br /><strong style={{ color: '#a5b4fc' }}>{request.amount_crypto} {request.coin_symbol.split(' ')[0]}</strong> will be released to the receiver.</>}
        </p>
        {sessionId && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#6ee7b7', marginBottom: 24, wordBreak: 'break-all' }}>
            Ref: {sessionId}
          </div>
        )}
        <Link href="/" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'block', padding: '13px 0', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
          Back to WeMove
        </Link>
      </div>
    </div>
  )
}
