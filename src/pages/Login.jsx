import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Eye, EyeOff } from 'lucide-react'
import { login } from '../mock/api'
import { simpanLogin } from '../utils/auth'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [lihat, setLihat] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(email, password)
      simpanLogin(res.token, res.user)
      toast.success(`Selamat datang, ${res.user.namaUsaha}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShoppingBag size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-2xl">DaganganKu</span>
          </Link>
          <h1 className="text-white font-bold text-2xl">Masuk ke Akun</h1>
          <p className="text-purple-200 text-sm mt-1">Kelola usaha dan terima pembayaran</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="email@kamu.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={lihat ? 'text' : 'password'} className="input pr-11"
                  placeholder="Password kamu" value={password}
                  onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setLihat(!lihat)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Belum punya akun?{' '}
            <Link to="/daftar" className="text-purple-600 font-semibold hover:underline">Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
