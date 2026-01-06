"use client"

import { useEffect, useMemo, useState } from "react"
import { Elements, useElements, useStripe, CardElement } from "@stripe/react-stripe-js"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import Header from "./header"
import PaymentMethodSelector from "./payment-method-selector"
import PaymentForm from "./payment-form"
import OrderSummary from "./order-summary"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

export default function PaymentPage() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [stripeError, setStripeError] = useState<string | null>(null)

  useEffect(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!publishableKey || publishableKey === "pk_test_replace_with_your_key" || publishableKey.includes("example") || publishableKey.length < 30) {
      setStripeError(
        "⚠️ Stripe not configured. Add your publishable key to .env.local (get it from https://dashboard.stripe.com/test/apikeys)"
      )
      return
    }

    const promise = loadStripe(publishableKey)
    setStripePromise(promise)
    setStripeError(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {stripeError && (
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">{stripeError}</AlertDescription>
          </Alert>
        )}

        {stripePromise && (
          <Elements stripe={stripePromise}>
            <PaymentPageContent />
          </Elements>
        )}
      </div>
    </div>
  )
}

function PaymentPageContent() {
  const stripe = useStripe()
  const elements = useElements()
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [cardHolder, setCardHolder] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const items = useMemo(
    () => [
      { name: "Product 1", quantity: 1, price: 600 },
      { name: "Product 2", quantity: 1, price: 500 },
    ],
    []
  )
  const protectFee = 129
  const discount = 0
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])
  const total = subtotal + protectFee - discount
  const API_BASE = process.env.NEXT_PUBLIC_PAYMENTS_API || "http://localhost:8081"

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method)
    if (method === "card") {
      setIsDialogOpen(true)
    }
  }

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setStatusMessage({
        type: "error",
        text: "Payment system not ready. Please refresh after Stripe loads.",
      })
      return
    }

    if (!cardHolder) {
      setStatusMessage({ type: "error", text: "Please enter the card holder name." })
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setStatusMessage({ type: "error", text: "Card field is not ready yet. Please retry." })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const pmResult = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardHolder,
        },
      })

      if (pmResult.error || !pmResult.paymentMethod) {
        throw new Error(pmResult.error?.message || "Unable to create payment method.")
      }

      const response = await fetch(`${API_BASE}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "inr",
          paymentMethod: "card",
          paymentMethodId: pmResult.paymentMethod.id,
          cardHolder,
          customerEmail: undefined, // Optional: set if you collect email in your UI
          // Tip: backend can use cardHolder + customerEmail to create a unique Stripe Customer
          description: "E-commerce order payment",
        }),
      })

      if (!response.ok) {
        const rawError = await response.text()
        let errorData: any = {}
        try {
          errorData = JSON.parse(rawError)
        } catch {
          // ignore parse failure
        }

        console.error("Payment API error:", {
          status: response.status,
          statusText: response.statusText,
          body: rawError,
        })

        throw new Error(
          errorData.message || errorData.error || rawError || `Failed to create payment intent (status ${response.status}).`
        )
      }

      const data = await response.json()

      if (data.status === "succeeded" || data.paymentStatus === "succeeded") {
        cardElement.clear()
        setCardHolder("")
        setIsDialogOpen(false)
        setIsSuccessDialogOpen(true)
        setStatusMessage(null)
      } else if (data.status === "requires_action" && data.clientSecret) {
        const result = await stripe.confirmCardPayment(data.clientSecret)

        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message || "Payment authentication failed." })
        } else if (result.paymentIntent?.status === "succeeded") {
          cardElement.clear()
          setCardHolder("")
          setIsDialogOpen(false)
          setIsSuccessDialogOpen(true)
          setStatusMessage(null)
        }
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error("Payment failed. Please check your card details and try again.")
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong. Please retry.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PaymentMethodSelector selectedMethod={selectedMethod} onSelectMethod={handleMethodSelect} />
        </div>

        <div>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            protectFee={protectFee}
            discount={discount}
            total={total}
            onPayment={handlePayment}
            isLoading={isSubmitting || !stripe}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Enter Card Details</DialogTitle>
            <DialogDescription>
              Complete your payment securely. All transactions are encrypted and secure.
            </DialogDescription>
          </DialogHeader>
          <PaymentForm
            cardHolder={cardHolder}
            onCardHolderChange={setCardHolder}
            onSubmit={handlePayment}
            isSubmitting={isSubmitting || !stripe}
            statusMessage={statusMessage || undefined}
            payAmount={total}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </DialogDescription>
            <button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
