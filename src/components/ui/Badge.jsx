const styles = {
  synced: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-ocean-100 text-ocean-500',
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
}

const dots = {
  synced: 'bg-sync-green',
  pending: 'bg-sync-amber',
  error: 'bg-sync-red',
  draft: 'bg-gray-400',
  submitted: 'bg-blue-500',
  accepted: 'bg-sync-green',
}

export default function Badge({ status = 'info', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.info} ${className}`}>
      {status !== 'info' && dots[status] && (
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      )}
      {children}
    </span>
  )
}
