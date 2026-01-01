import { ArrowLeft, Lock } from "lucide-react"

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
          <Lock className="w-4 h-4" />
          100% Secure
        </div>
      </div>
    </div>
  )
}
