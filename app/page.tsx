import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-2xl font-bold" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          WeMove
        </span>
        <Link href="/create"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8 }}
          className="px-5 py-2 text-white text-sm font-semibold hover:opacity-90 transition">
          Create Payment Link
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
        <div className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold rounded-full" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
          Global Payments · Crypto Settlement
        </div>
        <h1 className="text-5xl font-extrabold leading-tight mb-6" style={{ color: '#f1f5f9' }}>
          Move money from <span style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>anywhere</span>.<br />
          Receive in <span style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>crypto</span>.
        </h1>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
          Create a payment link in seconds. Share it with your payer anywhere in the world. They pay in their local currency — you receive USDT, BTC, ETH, or BNB.
        </p>
        <Link href="/create"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 12, fontSize: 17, display: 'inline-block' }}
          className="px-10 py-4 text-white font-bold hover:opacity-90 transition shadow-lg">
          Create Your Payment Link →
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-bold mb-12" style={{ color: '#e2e8f0' }}>How it works</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { step: '01', icon: '🔗', title: 'Create Your Link', desc: 'Choose your crypto coin and wallet address, enter how much you want to receive, and generate a shareable payment link.' },
            { step: '02', icon: '🌍', title: 'Payer Opens the Link', desc: 'Your payer selects their country, sees the exact amount in their local currency, and picks their preferred payment method.' },
            { step: '03', icon: '₿', title: 'You Receive Crypto', desc: 'Payment is processed via the payer\'s local gateway. Funds arrive in your crypto wallet — fast, global, borderless.' },
          ].map(item => (
            <div key={item.step} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} className="p-6">
              <div className="text-xs font-bold mb-3" style={{ color: '#6366f1' }}>{item.step}</div>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported methods */}
      <section className="max-w-5xl mx-auto px-6 py-10 pb-20">
        <h2 className="text-center text-2xl font-bold mb-10" style={{ color: '#e2e8f0' }}>Payment methods accepted</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            { icon: '💳', name: 'Stripe', desc: 'US · EU · UK · Canada · Australia' },
            { icon: '🏦', name: 'Flutterwave', desc: 'Nigeria · Africa · Mobile Money' },
            { icon: '💸', name: 'Razorpay', desc: 'India · UPI · NetBanking' },
            { icon: '🛒', name: 'Mercado Pago', desc: 'Brazil · Mexico · Latin America' },
            { icon: '🔐', name: 'PayTabs', desc: 'UAE · Saudi Arabia · Middle East' },
            { icon: '₿', name: 'Direct Crypto', desc: 'Any country · Instant' },
          ].map(m => (
            <div key={m.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} className="p-4 flex items-start gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{m.name}</div>
                <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-xs" style={{ color: '#334155', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        © 2026 WeMove. Global payments, crypto settlement.
      </footer>
    </div>
  )
}
