# 🎯 Quick Start Guide - Stripe Payment Integration

## The Problem You're Solving

Your payments show as "Incomplete" in Stripe Dashboard because the PaymentIntent is created but never confirmed. This integration fixes that.

## ⚡ 2-Minute Setup

### 1. Get Your Stripe Key
- Visit: https://dashboard.stripe.com/test/apikeys
- Copy the **Publishable key** (starts with `pk_test_`)

### 2. Configure `.env.local`
Open `.env.local` and add your key:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### 3. Restart Dev Server
```bash
npm run dev
```

## ✅ Verification

1. Open http://localhost:3000
2. **No yellow warning banner** = Configured correctly ✅
3. Fill in test card: `4242 4242 4242 4242`
4. CVV: `123`, Expiry: `12/26`
5. Click Pay
6. Check Stripe Dashboard → Payment shows "Succeeded" ✅

## 🔄 How It Works Now

```
┌─────────────┐
│   Frontend  │  User enters card: 4242 4242...
└──────┬──────┘
       │ 1. Sends card details
       ↓
┌─────────────┐
│   Backend   │  Creates PaymentIntent with Stripe API
│ Spring Boot │  (Card → PaymentMethod → PaymentIntent)
└──────┬──────┘
       │ 2. Returns clientSecret
       ↓
┌─────────────┐
│   Frontend  │  3. Confirms payment with Stripe.js
│  Stripe.js  │  (if 3D Secure needed)
└──────┬──────┘
       │
       ↓
    ✅ Payment: Succeeded
```

## 🛠️ Backend Requirements

Your `/api/payments/create` endpoint receives:

```json
{
  "amount": 30628,
  "currency": "inr",
  "cardNumber": "4242424242424242",
  "cardHolder": "John Doe",
  "expMonth": 12,
  "expYear": 2026,
  "cvc": "123",
  "description": "E-commerce order payment"
}
```

**What your backend should do:**

1. Create a PaymentMethod from card details
2. Create a PaymentIntent with that PaymentMethod
3. Optionally confirm it immediately
4. Return the clientSecret (or status if already succeeded)

**Response Option A** (Succeeded immediately):
```json
{
  "status": "succeeded",
  "paymentIntentId": "pi_xxx"
}
```

**Response Option B** (Needs 3D Secure):
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## 🧪 Test Cards

| Card Number          | Result                  |
|----------------------|-------------------------|
| 4242 4242 4242 4242  | Success ✅              |
| 4000 0000 0000 0002  | Card Declined ❌        |
| 4000 0027 6000 3184  | Requires 3D Secure 🔒  |

All test cards:
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

## 📋 Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟡 Yellow Banner | Stripe key not configured |
| ⚫ Disabled Button | Stripe not loaded |
| 🟢 Green Message | Payment successful |
| 🔴 Red Message | Payment failed |

## ❌ Troubleshooting

### "Stripe is not loaded yet"
**Cause**: Placeholder key in `.env.local`  
**Fix**: Replace with your actual `pk_test_` key from Stripe Dashboard

### Yellow warning banner won't go away
**Cause**: Key contains "example" or is invalid  
**Fix**: Double-check you copied the correct key (Publishable key, not Secret key)

### "Failed to create payment intent"
**Cause**: Backend not running or wrong endpoint  
**Fix**: Ensure Spring Boot runs on `http://localhost:8081`

### Payment stays "Incomplete" in Dashboard
**Cause**: Backend creates PaymentIntent but doesn't attach payment method  
**Fix**: Update your backend to create PaymentMethod from card details first

## 🔐 Security Notes

- Frontend Stripe.js is only used for 3D Secure authentication
- Backend handles all card processing via Stripe API
- Never log card numbers
- Use test keys in development
- Switch to live keys (`pk_live_`) in production only after completing Stripe account verification

## 📖 Full Documentation

See [STRIPE_SETUP.md](STRIPE_SETUP.md) for complete technical details.
