"use client"

import { Plus } from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Props {
  items: OrderItem[]
  subtotal: number
  protectFee: number
  discount: number
  total: number
  onPayment: () => void
  isLoading?: boolean
}

export default function OrderSummary({ items, subtotal, protectFee, discount, total, onPayment, isLoading = false }: Props) {

  return (
    <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Price Summary</h2>

      {/* Items List */}
      <div className="mb-6">
        <button className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors">
          <span>
            Price ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
          <span className="font-bold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Protect Promise Fee */}
      <div className="flex items-center justify-between text-sm mb-6">
        <span className="text-gray-600">Protect Promise Fee</span>
        <span className="font-semibold text-gray-900">₹{protectFee}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Discount Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 hover:bg-green-100 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-green-700 text-sm">10% instant discount</h3>
          <Plus className="w-4 h-4 text-green-700" />
        </div>
        <p className="text-xs text-gray-600">Claim now with payment offers</p>
        <div className="flex gap-2 mt-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-semibold border border-gray-200">
            💳
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs border border-gray-200">
            🏦
          </div>
          <button className="flex-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition">+3 more</button>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Pay Button (Mobile) */}
      <button
        onClick={onPayment}
        disabled={isLoading}
        className="w-full lg:hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
      </button>
    </div>
  )
}
