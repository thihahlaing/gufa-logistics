'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function DevTestPage() {
  const router = useRouter()

  const handleLogin = (role: 'driver' | 'merchant' | 'admin') => {
    Cookies.set('dev-role', role, { expires: 1, path: '/' })
    if (role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-gufa-blue-800 mb-4">Gufa Logistics</h1>
        <p className="text-lg text-gray-600 mb-8">The Lalamove of Myanmar - Dev Portal</p>
        <div className="flex space-x-4">
            <button
                onClick={() => handleLogin('merchant')}
                className="bg-gufa-blue-600 hover:bg-gufa-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
            >
                Login as Merchant
            </button>
            <button
                onClick={() => handleLogin('driver')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
            >
                Login as Driver
            </button>
            <button
                onClick={() => handleLogin('admin')}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
            >
                Login as Admin
            </button>
        </div>
    </div>
  )
}
