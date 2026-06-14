import { NextRequest, NextResponse } from 'next/server'
import { getCryptoPricesUSD, getFiatRate } from '@/lib/rates'

export async function GET(req: NextRequest) {
  const currency = req.nextUrl.searchParams.get('currency') ?? 'USD'
  const [cryptoPrices, fiatRate] = await Promise.all([getCryptoPricesUSD(), getFiatRate(currency)])
  return NextResponse.json({ cryptoPrices, fiatRate, currency })
}
