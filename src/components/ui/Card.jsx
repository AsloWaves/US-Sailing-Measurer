export default function Card({ className = '', children, onClick, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-navy-100 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md hover:border-navy-200 transition-shadow' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
