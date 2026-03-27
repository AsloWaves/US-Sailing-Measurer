import { useSettings } from '../../context/SettingsContext'
import { unitLabel } from '../../lib/calculations'

export default function Input({
  label,
  abbr,
  description,
  type = 'number',
  suffix,
  showUnit = false,
  className = '',
  error,
  ...props
}) {
  const { units } = useSettings()
  const displaySuffix = suffix || (showUnit ? unitLabel(units) : null)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-navy-700 flex items-baseline gap-2">
        {abbr && (
          <span className="text-navy-900 font-bold text-base">{abbr}</span>
        )}
        <span>{label}</span>
      </label>
      <div className="relative">
        <input
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          step={type === 'number' ? '0.001' : undefined}
          min={type === 'number' ? '0' : undefined}
          className={`w-full rounded-lg border bg-white px-3 py-3 text-base
            placeholder:text-navy-300 transition-colors
            focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400
            min-h-12 ${error ? 'border-sync-red' : 'border-navy-200'}
            ${displaySuffix ? 'pr-12' : ''}`}
          {...props}
        />
        {displaySuffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy-400 pointer-events-none">
            {displaySuffix}
          </span>
        )}
      </div>
      {description && !error && (
        <p className="text-xs text-navy-400">{description}</p>
      )}
      {error && (
        <p className="text-xs text-sync-red">{error}</p>
      )}
    </div>
  )
}

export function FtInInput({
  label,
  abbr,
  description,
  value = {},
  onChange,
  onFocus,
  onBlur,
  className = '',
  error,
}) {
  const feet = value?.feet ?? ''
  const inches = value?.inches ?? ''

  const handleFeet = (e) => {
    onChange({ feet: e.target.value, inches })
  }
  const handleInches = (e) => {
    onChange({ feet, inches: e.target.value })
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-navy-700 flex items-baseline gap-2">
        {abbr && (
          <span className="text-navy-900 font-bold text-base">{abbr}</span>
        )}
        <span>{label}</span>
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="numeric"
            step="1"
            min="0"
            value={feet}
            onChange={handleFeet}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="0"
            className={`w-full rounded-lg border bg-white px-3 py-3 text-base pr-10
              placeholder:text-navy-300 transition-colors
              focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400
              min-h-12 ${error ? 'border-sync-red' : 'border-navy-200'}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy-400 pointer-events-none">ft</span>
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            max="11.99"
            value={inches}
            onChange={handleInches}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="0.0"
            className={`w-full rounded-lg border bg-white px-3 py-3 text-base pr-10
              placeholder:text-navy-300 transition-colors
              focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400
              min-h-12 ${error ? 'border-sync-red' : 'border-navy-200'}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy-400 pointer-events-none">in</span>
        </div>
      </div>
      {description && !error && (
        <p className="text-xs text-navy-400">{description}</p>
      )}
      {error && (
        <p className="text-xs text-sync-red">{error}</p>
      )}
    </div>
  )
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-navy-700">{label}</label>}
      <select
        className="w-full rounded-lg border border-navy-200 bg-white px-3 py-3 text-base
          focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400
          min-h-12"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function TextArea({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-navy-700">{label}</label>}
      <textarea
        className="w-full rounded-lg border border-navy-200 bg-white px-3 py-3 text-base
          placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-ocean-400
          focus:border-ocean-400 min-h-24 resize-y"
        {...props}
      />
    </div>
  )
}
