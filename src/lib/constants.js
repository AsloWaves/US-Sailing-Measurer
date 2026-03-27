// Measurement definitions keyed by abbreviation
export const MEASUREMENT_DEFS = {
  // Mainsail
  P:    { label: 'Mainsail Luff',        abbr: 'P',    description: 'Distance along aft face of mast from boom to highest hoist point', unit: 'length' },
  E:    { label: 'Mainsail Foot',         abbr: 'E',    description: 'Distance along boom from mast to outermost boom point', unit: 'length' },
  MHB:  { label: 'Head Width',            abbr: 'MHB',  description: 'Width of mainsail at the head', unit: 'length' },
  MQW:  { label: 'Quarter Width',         abbr: 'MQW',  description: 'Width at 1/4 leech height from head', unit: 'length' },
  MHW:  { label: 'Half Width',            abbr: 'MHW',  description: 'Width at 1/2 leech height', unit: 'length' },
  MTW:  { label: 'Three-Quarter Width',   abbr: 'MTW',  description: 'Width at 3/4 leech height', unit: 'length' },
  MUW:  { label: 'Upper Width',           abbr: 'MUW',  description: 'Width at 7/8 leech height', unit: 'length' },
  BD:   { label: 'Boom Diameter',         abbr: 'BD',   description: 'Maximum vertical cross-section of boom', unit: 'length' },

  // Headsail
  HLU:  { label: 'Headsail Luff',         abbr: 'HLU',  description: 'Total length of headsail luff', unit: 'length' },
  HLP:  { label: 'Luff Perpendicular',    abbr: 'HLP',  description: 'Shortest distance from clew to luff line', unit: 'length' },
  HHB:  { label: 'Head Width',            abbr: 'HHB',  description: 'Width at the head of the headsail', unit: 'length' },
  HQW:  { label: 'Quarter Width',         abbr: 'HQW',  description: 'Width at 1/4 leech height from head', unit: 'length' },
  HHW:  { label: 'Half Width',            abbr: 'HHW',  description: 'Width at 1/2 leech height', unit: 'length' },
  HTW:  { label: 'Three-Quarter Width',   abbr: 'HTW',  description: 'Width at 3/4 leech height', unit: 'length' },
  HUW:  { label: 'Upper Width',           abbr: 'HUW',  description: 'Width at 7/8 leech height', unit: 'length' },

  // Spinnaker
  SLU:  { label: 'Spinnaker Luff',        abbr: 'SLU',  description: 'Length along the luff from head to tack', unit: 'length' },
  SLE:  { label: 'Spinnaker Leech',       abbr: 'SLE',  description: 'Length along the leech from head to clew', unit: 'length' },
  SHW:  { label: 'Half Width',            abbr: 'SHW',  description: 'Distance between midpoints on luff and leech', unit: 'length' },
  SFL:  { label: 'Foot Length',           abbr: 'SFL',  description: 'Length of the spinnaker foot', unit: 'length' },
  SPL:  { label: 'Spinnaker Pole',        abbr: 'SPL',  description: 'Distance from forward face of mast to end of spinnaker pole', unit: 'length' },
  TPS:  { label: 'Tack Point to Stem',    abbr: 'TPS',  description: 'Distance from asymmetric spinnaker tack point to stem', unit: 'length' },

  // Rig dimensions
  I:    { label: 'Foretriangle Height',   abbr: 'I',    description: 'Height of foretriangle (deck to forestay attachment on mast)', unit: 'length' },
  J:    { label: 'Foretriangle Base',     abbr: 'J',    description: 'Base of foretriangle (mast to forestay at deck)', unit: 'length' },
  ISP:  { label: 'Spinnaker Halyard Height', abbr: 'ISP', description: 'Distance from deck to top of highest spinnaker halyard sheave', unit: 'length' },

  // Mizzen
  PY:   { label: 'Mizzen Luff',           abbr: 'PY',   description: 'Mizzen luff length (same as P for mizzen)', unit: 'length' },
  EY:   { label: 'Mizzen Foot',           abbr: 'EY',   description: 'Mizzen foot length (same as E for mizzen)', unit: 'length' },
  MHBY: { label: 'Mizzen Head Width',     abbr: 'MHBY', description: 'Width at head of mizzen', unit: 'length' },
  MQWY: { label: 'Mizzen Quarter Width',  abbr: 'MQWY', description: 'Mizzen width at 1/4 leech height', unit: 'length' },
  MHWY: { label: 'Mizzen Half Width',     abbr: 'MHWY', description: 'Mizzen width at 1/2 leech height', unit: 'length' },
  MTWY: { label: 'Mizzen 3/4 Width',      abbr: 'MTWY', description: 'Mizzen width at 3/4 leech height', unit: 'length' },
  MUWY: { label: 'Mizzen Upper Width',    abbr: 'MUWY', description: 'Mizzen width at 7/8 leech height', unit: 'length' },
}

// Sail types and which measurements they use
export const SAIL_TYPES = {
  mainsail: {
    label: 'Mainsail',
    icon: '⛵',
    category: 'mainsail',
    measurements: ['P', 'E', 'MHB', 'MQW', 'MHW', 'MTW', 'MUW', 'BD'],
    requiredFor: ['PHRF', 'ORR', 'ORC', 'IRC'],
  },
  headsail: {
    label: 'Headsail (Jib/Genoa)',
    icon: '🔺',
    category: 'headsail',
    measurements: ['HLU', 'HLP', 'HHB', 'HQW', 'HHW', 'HTW', 'HUW'],
    requiredFor: ['ORC', 'IRC'],
  },
  spinnaker_sym: {
    label: 'Spinnaker (Symmetric)',
    icon: '🎈',
    category: 'spinnaker',
    measurements: ['SLU', 'SLE', 'SHW', 'SFL'],
    requiredFor: ['ORC', 'IRC'],
  },
  spinnaker_asym: {
    label: 'Spinnaker (Asymmetric)',
    icon: '🪁',
    category: 'spinnaker',
    measurements: ['SLU', 'SLE', 'SHW', 'SFL', 'TPS'],
    requiredFor: ['ORC', 'IRC'],
  },
  rig: {
    label: 'Rig Dimensions',
    icon: '📐',
    category: 'rig',
    measurements: ['I', 'J', 'ISP', 'SPL'],
    requiredFor: ['PHRF', 'ORR', 'ORC', 'IRC'],
  },
  mizzen: {
    label: 'Mizzen',
    icon: '🚢',
    category: 'mainsail',
    measurements: ['PY', 'EY', 'MHBY', 'MQWY', 'MHWY', 'MTWY', 'MUWY'],
    requiredFor: ['ORC', 'IRC'],
  },
}

export const RATING_SYSTEMS = ['PHRF', 'ORR', 'ORC', 'IRC']

// Measurement workflow statuses (separate from GitHub sync status)
export const MEASUREMENT_STATUSES = {
  draft:     { label: 'Draft',     badge: 'draft' },
  pending:   { label: 'Pending',   badge: 'pending' },
  submitted: { label: 'Submitted', badge: 'submitted' },
  accepted:  { label: 'Accepted',  badge: 'accepted' },
}

// ─── Boat & Job Constants ───

export const RIG_TYPES = ['Sloop', 'Cutter', 'Ketch', 'Yawl', 'Cat', 'Schooner', 'Other']
export const MAST_MATERIALS = ['Aluminum', 'Carbon', 'Wood', 'Other']

export const JOB_TYPES = {
  sail_measurement:  { label: 'Sail Measurement',           icon: '📐' },
  standing_rigging:  { label: 'Standing Rigging Inspection', icon: '🔧' },
  running_rigging:   { label: 'Running Rigging Service',     icon: '🪢' },
  sail_repair:       { label: 'Sail Repair / Condition',     icon: '🧵' },
}

export const JOB_STATUSES = {
  open:        { label: 'Open',        badge: 'draft' },
  in_progress: { label: 'In Progress', badge: 'pending' },
  completed:   { label: 'Completed',   badge: 'accepted' },
  invoiced:    { label: 'Invoiced',    badge: 'submitted' },
}

// ─── Sail Materials ───

export const MATERIALS = [
  'Dacron',
  'Mylar/Laminate',
  'Carbon',
  'Kevlar/Aramid',
  'Nylon',
  'Polyester',
  'Composite/3Di',
  'Other',
]

// Unit conversion
export const METERS_TO_FEET = 3.28084
export const FEET_TO_METERS = 1 / 3.28084
export const SQ_METERS_TO_SQ_FEET = 10.7639
