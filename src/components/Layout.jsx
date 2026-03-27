import { Outlet, Link, useLocation } from 'react-router-dom'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/new', label: 'New', icon: PlusIcon },
  { path: '/settings', label: 'Settings', icon: GearIcon },
]

export default function Layout() {
  const isOnline = useOnlineStatus()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      {/* Top header */}
      <header className="bg-navy-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 no-underline text-white">
          <svg viewBox="0 0 64 64" className="w-8 h-8">
            <rect width="64" height="64" rx="12" fill="#334e68"/>
            <path d="M32 8 L32 52 L16 52 Q16 28 32 8Z" fill="#ffffff" opacity="0.9"/>
            <path d="M34 14 L34 48 L48 48 Q48 28 34 14Z" fill="#ffffff" opacity="0.6"/>
            <line x1="12" y1="54" x2="52" y2="54" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-semibold tracking-tight">US Sailing Measurer</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs ${isOnline ? 'text-green-300' : 'text-amber-300'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-sync-green' : 'bg-sync-amber'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-navy-100 z-40 sm:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 text-xs no-underline transition-colors
                  ${active ? 'text-navy-900' : 'text-navy-400'}`}
              >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop nav (sidebar-less — just top links on larger screens) */}
      <nav className="hidden sm:flex fixed bottom-0 inset-x-0 bg-white border-t border-navy-100 z-40 justify-center gap-8 h-14 items-center">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm no-underline transition-colors
                ${active ? 'text-navy-900 bg-navy-100 font-medium' : 'text-navy-500 hover:text-navy-700'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// Simple inline SVG icons
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function GearIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
