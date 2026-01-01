import type { Metadata } from "next"
import PaymentPage from "@/components/payment/payment-page"

export const metadata: Metadata = {
  title: "Complete Payment - E-Commerce",
  description: "Secure payment checkout page with multiple payment methods",
}

export default function Home() {
  return <PaymentPage />
}
