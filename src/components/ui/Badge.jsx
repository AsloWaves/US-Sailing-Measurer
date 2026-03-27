const styles = {
  synced: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-ocean-100 text-ocean-500',
}

export default function Badge({ status = 'info', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.info} ${className}`}>
      {status !== 'info' && (
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
          status === 'synced' ? 'bg-sync-green' :
          status === 'pending' ? 'bg-sync-amber' :
          'bg-sync-red'
        }`} />
      )}
      {children}
    </span>
  )
}
