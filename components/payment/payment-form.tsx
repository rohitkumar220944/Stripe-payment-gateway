"use client"

import { CardElement } from "@stripe/react-stripe-js"
import { HelpCircle } from "lucide-react"

interface Props {
  cardHolder: string
  onCardHolderChange: (value: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
  statusMessage?: { type: "success" | "error"; text: string }
  payAmount?: number
}

export default function PaymentForm({ cardHolder, onCardHolderChange, onSubmit, isSubmitting = false, statusMessage, payAmount }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-900">Note:</span> Please ensure your card can be used for online
          transactions.
          <a href="#" className="text-blue-600 hover:underline font-semibold ml-1">
            Learn More
          </a>
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Card Details</label>
          <div className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#111827",
                    "::placeholder": { color: "#6B7280" },
                  },
                },
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Card Holder Name</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Name on card"
              value={cardHolder}
              onChange={(e) => onCardHolderChange(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-blue-100 focus:bg-white"
              autoComplete="cc-name"
            />
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help hover:text-blue-500 transition" />
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full mt-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : `Pay ₹${(payAmount ?? 0).toLocaleString("en-IN")}`}
        </button>

        {statusMessage && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              statusMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  )
}
