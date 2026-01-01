"use client"

import { CreditCard, Smartphone, Zap, Building2, Truck } from "lucide-react"

const paymentMethods = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay by any UPI app",
    offer: "Get upto ₹150 cashback • 4 offers available",
    icon: Smartphone,
  },
  {
    id: "card",
    name: "Credit / Debit / ATM Card",
    description: "Add and secure cards as per RBI guidelines",
    offer: "Get upto 5% cashback • 2 offers available",
    icon: CreditCard,
  },
  {
    id: "emi",
    name: "EMI",
    description: "Get Debit and Cardless EMIs on HDFC Bank",
    icon: Zap,
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "Pay securely using your bank account",
    icon: Building2,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Truck,
  },
]

interface Props {
  selectedMethod: string
  onSelectMethod: (method: string) => void
}

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="divide-y divide-gray-200">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon
          return (
            <button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`w-full p-5 transition-all duration-200 text-left ${
                selectedMethod === method.id
                  ? "bg-gradient-to-r from-blue-50 to-blue-25 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {selectedMethod === method.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent
                      className={`w-5 h-5 transition ${
                        selectedMethod === method.id ? "text-blue-500" : "text-gray-500"
                      }`}
                    />
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                  {method.offer && <p className="text-xs text-green-600 font-medium">{method.offer}</p>}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
