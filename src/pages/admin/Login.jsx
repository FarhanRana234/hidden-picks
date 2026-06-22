import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#111] border border-[#222] p-8 rounded-lg">
        <h1 className="font-heading text-2xl font-bold text-center mb-6">admin login</h1>
        {error && <p className="text-[#FF2D78] text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          <button type="submit" className="w-full bg-[#FF2D78] text-white py-3 font-semibold text-sm rounded hover:bg-[#FF2D78]/90 transition">
            sign in
          </button>
        </div>
      </form>
    </div>
  )
}
