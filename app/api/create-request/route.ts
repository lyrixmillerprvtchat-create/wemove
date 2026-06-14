import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { coin_id, coin_symbol, network, wallet_address, amount_crypto, amount_usd, note } = await req.json()

  if (!coin_id || !wallet_address || !amount_crypto) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('payment_requests')
    .insert({ coin_id, coin_symbol, network, wallet_address, amount_crypto: parseFloat(amount_crypto), amount_usd: parseFloat(amount_usd), note })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
