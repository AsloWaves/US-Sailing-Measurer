const variants = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950',
  secondary: 'bg-white text-navy-900 border border-navy-200 hover:bg-navy-50 active:bg-navy-100',
  danger: 'bg-sync-red text-white hover:bg-red-600 active:bg-red-700',
  ghost: 'text-navy-700 hover:bg-navy-100 active:bg-navy-200',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium
        transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        min-h-12 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
