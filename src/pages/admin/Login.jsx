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
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 shadow-md">
        <h1 className="font-heading text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-dark/20 px-3 py-2 text-sm" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-dark/20 px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-dark text-white py-3 font-semibold uppercase tracking-wider text-sm hover:bg-accent transition">
            Sign In
          </button>
        </div>
      </form>
    </div>
  )
}
