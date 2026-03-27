import { Outlet, Link, useLocation } from 'react-router-dom'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const navItems = [
  { path: '/', label: 'Jobs', icon: ClipboardIcon, exact: true },
  { path: '/boats', label: 'Boats', icon: AnchorIcon },
  { path: '/measurements', label: 'Sails', icon: SailIcon },
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
          <span className="text-lg font-semibold tracking-tight">Rigging Pro</span>
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

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-navy-100 z-40">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
          {navItems.map(({ path, label, icon: Icon, exact }) => {
            const active = exact
              ? location.pathname === '/' || location.pathname.startsWith('/job')
              : location.pathname.startsWith(path)
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs no-underline transition-colors
                  ${active ? 'text-navy-900' : 'text-navy-400'}`}
              >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

// ─── Icons ───

function ClipboardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  )
}

function AnchorIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12 6.75v14.5M5.25 13.5c0 3.728 3.022 6.75 6.75 6.75s6.75-3.022 6.75-6.75M8.25 10.5h7.5" />
    </svg>
  )
}

function SailIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L12 19M12 3C12 3 6 9 6 19H12M12 3C12 3 18 9 18 17H12M4 21h16" />
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
