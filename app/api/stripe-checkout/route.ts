import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { amount_usd, coin_symbol, request_id, payer_country, currency, fiat_amount } = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: Math.round(fiat_amount * 100),
          product_data: {
            name: `WeMove Payment — ${coin_symbol}`,
            description: `Equivalent to $${amount_usd.toFixed(2)} USD · Payment ID: ${request_id}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${request_id}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${request_id}`,
    metadata: { request_id, payer_country },
  })

  return NextResponse.json({ url: session.url })
}
