const DIAGRAMS = {
  mainsail: MainsailDiagram,
  headsail: HeadsailDiagram,
  spinnaker_sym: SpinnakerDiagram,
  spinnaker_asym: SpinnakerDiagram,
  rig: RigDiagram,
  mizzen: MainsailDiagram,
}

export default function SailDiagram({ sailType, highlighted }) {
  const Diagram = DIAGRAMS[sailType]
  if (!Diagram) return null

  return (
    <div className="bg-white rounded-lg border border-navy-100 p-3 flex justify-center">
      <Diagram highlighted={highlighted} />
    </div>
  )
}

function MainsailDiagram({ highlighted }) {
  const hl = (abbr) => highlighted === abbr ? '#2680d2' : '#9fb3c8'
  const hlW = (abbr) => highlighted === abbr ? 2.5 : 1.5
  const hlT = (abbr) => highlighted === abbr ? 'font-weight:bold;fill:#1e3a5f' : 'fill:#627d98'

  return (
    <svg viewBox="0 0 220 280" className="w-full max-w-[200px] h-auto">
      {/* Sail shape */}
      <path d="M40 250 L40 30 L180 250 Z" fill="#e6f0fa" stroke="#334e68" strokeWidth="2" />

      {/* P - luff (left side) */}
      <line x1="25" y1="250" x2="25" y2="30" stroke={hl('P')} strokeWidth={hlW('P')} />
      <text x="12" y="140" fontSize="11" style={{...s(hlT('P'))}}>P</text>

      {/* E - foot (bottom) */}
      <line x1="40" y1="262" x2="180" y2="262" stroke={hl('E')} strokeWidth={hlW('E')} />
      <text x="105" y="275" fontSize="11" textAnchor="middle" style={{...s(hlT('E'))}}>E</text>

      {/* MHW - half width */}
      <line x1="40" y1="140" x2="110" y2="140" stroke={hl('MHW')} strokeWidth={hlW('MHW')} strokeDasharray="4 2" />
      <text x="78" y="135" fontSize="9" textAnchor="middle" style={{...s(hlT('MHW'))}}>MHW</text>

      {/* MQW - quarter width */}
      <line x1="40" y1="195" x2="145" y2="195" stroke={hl('MQW')} strokeWidth={hlW('MQW')} strokeDasharray="4 2" />
      <text x="95" y="190" fontSize="9" textAnchor="middle" style={{...s(hlT('MQW'))}}>MQW</text>

      {/* MTW - three-quarter width */}
      <line x1="40" y1="85" x2="75" y2="85" stroke={hl('MTW')} strokeWidth={hlW('MTW')} strokeDasharray="4 2" />
      <text x="60" y="80" fontSize="9" textAnchor="middle" style={{...s(hlT('MTW'))}}>MTW</text>

      {/* MUW - upper width */}
      <line x1="40" y1="57" x2="57" y2="57" stroke={hl('MUW')} strokeWidth={hlW('MUW')} strokeDasharray="4 2" />
      <text x="52" y="52" fontSize="9" textAnchor="middle" style={{...s(hlT('MUW'))}}>MUW</text>

      {/* MHB - head */}
      <circle cx="40" cy="30" r="3" fill={hl('MHB')} />
      <text x="50" y="25" fontSize="9" style={{...s(hlT('MHB'))}}>MHB</text>
    </svg>
  )
}

function HeadsailDiagram({ highlighted }) {
  const hl = (abbr) => highlighted === abbr ? '#2680d2' : '#9fb3c8'
  const hlW = (abbr) => highlighted === abbr ? 2.5 : 1.5
  const hlT = (abbr) => highlighted === abbr ? 'font-weight:bold;fill:#1e3a5f' : 'fill:#627d98'

  return (
    <svg viewBox="0 0 220 280" className="w-full max-w-[200px] h-auto">
      {/* Sail shape */}
      <path d="M60 250 L60 30 L190 250 Z" fill="#e6f0fa" stroke="#334e68" strokeWidth="2" />

      {/* HLU - luff */}
      <line x1="45" y1="250" x2="45" y2="30" stroke={hl('HLU')} strokeWidth={hlW('HLU')} />
      <text x="30" y="140" fontSize="11" style={{...s(hlT('HLU'))}}>HLU</text>

      {/* HLP - luff perpendicular */}
      <line x1="60" y1="250" x2="190" y2="250" stroke={hl('HLP')} strokeWidth={hlW('HLP')} strokeDasharray="4 2" />
      <text x="125" y="245" fontSize="9" textAnchor="middle" style={{...s(hlT('HLP'))}}>HLP</text>

      {/* HHW - half width */}
      <line x1="60" y1="140" x2="125" y2="140" stroke={hl('HHW')} strokeWidth={hlW('HHW')} strokeDasharray="4 2" />
      <text x="95" y="135" fontSize="9" textAnchor="middle" style={{...s(hlT('HHW'))}}>HHW</text>

      {/* HQW */}
      <line x1="60" y1="195" x2="157" y2="195" stroke={hl('HQW')} strokeWidth={hlW('HQW')} strokeDasharray="4 2" />
      <text x="110" y="190" fontSize="9" textAnchor="middle" style={{...s(hlT('HQW'))}}>HQW</text>

      {/* HTW */}
      <line x1="60" y1="85" x2="93" y2="85" stroke={hl('HTW')} strokeWidth={hlW('HTW')} strokeDasharray="4 2" />
      <text x="79" y="80" fontSize="9" textAnchor="middle" style={{...s(hlT('HTW'))}}>HTW</text>

      {/* HUW */}
      <line x1="60" y1="57" x2="76" y2="57" stroke={hl('HUW')} strokeWidth={hlW('HUW')} strokeDasharray="4 2" />
      <text x="72" y="52" fontSize="9" textAnchor="middle" style={{...s(hlT('HUW'))}}>HUW</text>

      {/* HHB */}
      <circle cx="60" cy="30" r="3" fill={hl('HHB')} />
      <text x="70" y="25" fontSize="9" style={{...s(hlT('HHB'))}}>HHB</text>
    </svg>
  )
}

function SpinnakerDiagram({ highlighted }) {
  const hl = (abbr) => highlighted === abbr ? '#2680d2' : '#9fb3c8'
  const hlW = (abbr) => highlighted === abbr ? 2.5 : 1.5
  const hlT = (abbr) => highlighted === abbr ? 'font-weight:bold;fill:#1e3a5f' : 'fill:#627d98'

  return (
    <svg viewBox="0 0 220 280" className="w-full max-w-[200px] h-auto">
      {/* Spinnaker balloon shape */}
      <path d="M110 20 Q30 100 30 180 Q30 240 60 260 L160 260 Q190 240 190 180 Q190 100 110 20Z"
        fill="#e6f0fa" stroke="#334e68" strokeWidth="2" />

      {/* SLU - luff (left) */}
      <line x1="20" y1="260" x2="100" y2="20" stroke={hl('SLU')} strokeWidth={hlW('SLU')} />
      <text x="45" y="130" fontSize="11" style={{...s(hlT('SLU'))}}>SLU</text>

      {/* SLE - leech (right) */}
      <line x1="120" y1="20" x2="200" y2="260" stroke={hl('SLE')} strokeWidth={hlW('SLE')} />
      <text x="172" y="130" fontSize="11" style={{...s(hlT('SLE'))}}>SLE</text>

      {/* SFL - foot */}
      <line x1="60" y1="270" x2="160" y2="270" stroke={hl('SFL')} strokeWidth={hlW('SFL')} />
      <text x="110" y="278" fontSize="10" textAnchor="middle" style={{...s(hlT('SFL'))}}>SFL</text>

      {/* SHW - half width */}
      <line x1="35" y1="145" x2="185" y2="145" stroke={hl('SHW')} strokeWidth={hlW('SHW')} strokeDasharray="4 2" />
      <text x="110" y="140" fontSize="10" textAnchor="middle" style={{...s(hlT('SHW'))}}>SHW</text>
    </svg>
  )
}

function RigDiagram({ highlighted }) {
  const hl = (abbr) => highlighted === abbr ? '#2680d2' : '#9fb3c8'
  const hlW = (abbr) => highlighted === abbr ? 2.5 : 1.5
  const hlT = (abbr) => highlighted === abbr ? 'font-weight:bold;fill:#1e3a5f' : 'fill:#627d98'

  return (
    <svg viewBox="0 0 220 280" className="w-full max-w-[200px] h-auto">
      {/* Mast */}
      <line x1="60" y1="260" x2="60" y2="20" stroke="#334e68" strokeWidth="4" />

      {/* Forestay */}
      <line x1="60" y1="40" x2="180" y2="260" stroke="#829ab1" strokeWidth="1.5" />

      {/* Deck line */}
      <line x1="30" y1="260" x2="200" y2="260" stroke="#334e68" strokeWidth="2" />

      {/* Foretriangle fill */}
      <path d="M60 40 L60 260 L180 260 Z" fill="#e6f0fa" opacity="0.5" />

      {/* I - height */}
      <line x1="40" y1="260" x2="40" y2="40" stroke={hl('I')} strokeWidth={hlW('I')} />
      <text x="25" y="150" fontSize="14" style={{...s(hlT('I'))}}>I</text>

      {/* J - base */}
      <line x1="60" y1="272" x2="180" y2="272" stroke={hl('J')} strokeWidth={hlW('J')} />
      <text x="120" y="278" fontSize="14" textAnchor="middle" style={{...s(hlT('J'))}}>J</text>

      {/* ISP marker */}
      <line x1="75" y1="30" x2="75" y2="260" stroke={hl('ISP')} strokeWidth={hlW('ISP')} strokeDasharray="6 3" />
      <text x="82" y="140" fontSize="11" style={{...s(hlT('ISP'))}}>ISP</text>

      {/* SPL marker */}
      <line x1="60" y1="240" x2="140" y2="240" stroke={hl('SPL')} strokeWidth={hlW('SPL')} strokeDasharray="4 2" />
      <text x="100" y="235" fontSize="10" textAnchor="middle" style={{...s(hlT('SPL'))}}>SPL</text>
    </svg>
  )
}

// Helper to parse inline style string to object
function s(styleStr) {
  const obj = {}
  styleStr.split(';').forEach(part => {
    const [k, v] = part.split(':').map(s => s.trim())
    if (k && v) {
      const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      obj[camel] = v
    }
  })
  return obj
}
