# Stripe Integration Setup Guide

## 🚨 IMMEDIATE ACTION REQUIRED

You're seeing "Stripe is not loaded yet" because the Stripe publishable key needs to be configured.

### Quick Fix (2 minutes):

**Step 1:** Get your Stripe key
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Sign in (or create a free test account)
3. Copy the **Publishable key** (starts with `pk_test_`)

**Step 2:** Add the key to `.env.local`
1. Open [.env.local](.env.local) in VS Code
2. Replace the example key with your actual key:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**Step 3:** Restart the dev server
- Stop the current server (Ctrl+C)
- Run: `npm run dev`

## ✅ How to Verify It's Working

1. Open http://localhost:3000
2. You should **NOT** see the yellow warning banner
3. The Pay button should be enabled
4. Fill in card details and click Pay
5. Check your Stripe Dashboard - payment will show as "Succeeded" ✅

## 🔄 Complete Payment Flow

```
1. User enters card details in your UI
   ↓
2. Frontend creates PaymentMethod with Stripe.js
   ↓
3. Backend creates PaymentIntent (using PaymentMethod ID)
   ↓
4. Frontend confirms payment with Stripe
   ↓
5. Payment shows as "Succeeded" in Dashboard ✅
```

## 🧪 Test Cards

Use these for testing:

| Card Number         | Scenario      |
|---------------------|---------------|
| 4242 4242 4242 4242 | Success       |
| 4000 0000 0000 0002 | Declined      |
| 4000 0027 6000 3184 | 3D Secure Auth|

- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/26`)
- **Name**: Any name

## 🔧 Backend API Requirements

Your Spring Boot `/api/payments/create` endpoint should accept:

```json
{
  "amount": 30628,
  "currency": "inr",
  "paymentMethodId": "pm_xxx",
  "description": "E-commerce order payment"
}
```

And return:

```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## 📋 Visual Indicators

- **Yellow Warning Banner**: Stripe key not configured or invalid
- **Disabled Pay Button**: Stripe not loaded
- **Green Success Message**: Payment completed successfully
- **Red Error Message**: Payment failed (see error details)

## 🔐 Security Notes

- Card details are handled entirely by Stripe.js
- Your backend never receives sensitive card information
- PCI compliance handled automatically by Stripe
- Only PaymentMethod IDs are sent to your backend

## ❌ Common Issues

### "Stripe is not loaded yet"
**Cause**: Missing or invalid Stripe key
**Fix**: Add your actual `pk_test_` key to `.env.local` and restart server

### Yellow warning banner persists
**Cause**: The key contains "example" or is too short
**Fix**: Use your real Stripe publishable key from dashboard

### Payment stays "Incomplete"
**Cause**: Payment not confirmed by frontend
**Fix**: This integration now handles confirmation properly ✅

### Network error on payment
**Cause**: Backend not running or wrong URL
**Fix**: Ensure Spring Boot is running on `http://localhost:8081`

