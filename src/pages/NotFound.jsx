import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound({ theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const accent = '#2D6A4F'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: bg }}
    >
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1
          className="font-serif text-4xl font-bold mb-4"
          style={{ color: text }}
        >
          404
        </h1>
        <p className="text-lg mb-3" style={{ color: muted }}>
          页面不存在
        </p>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: muted }}>
          你访问的页面可能已被移动、删除，或者从未存在过。
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
            style={{ background: accent, color: '#fff' }}
          >
            <Home size={16} />
            返回首页
          </Link>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:brightness-95"
            style={{
              color: accent,
              borderColor: accent,
              background: 'transparent',
            }}
          >
            <Search size={16} />
            看看作品
          </Link>
        </div>
      </div>
    </div>
  )
}
