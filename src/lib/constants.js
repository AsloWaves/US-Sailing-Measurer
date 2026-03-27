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

// ─── Standing Rigging Constants ───

export const STANDING_RIGGING_COMPONENTS = {
  forestay:    { label: 'Forestay', category: 'Stays' },
  backstay:    { label: 'Backstay', category: 'Stays' },
  baby_stay:   { label: 'Baby Stay / Inner Forestay', category: 'Stays' },
  v1_port:     { label: 'Upper Shroud V1 (Port)', category: 'Shrouds' },
  v1_stbd:     { label: 'Upper Shroud V1 (Starboard)', category: 'Shrouds' },
  v2_port:     { label: 'Intermediate V2 (Port)', category: 'Shrouds' },
  v2_stbd:     { label: 'Intermediate V2 (Starboard)', category: 'Shrouds' },
  d1_port:     { label: 'Lower Shroud D1 (Port)', category: 'Shrouds' },
  d1_stbd:     { label: 'Lower Shroud D1 (Starboard)', category: 'Shrouds' },
  d2_port:     { label: 'Lower Shroud D2 (Port)', category: 'Shrouds' },
  d2_stbd:     { label: 'Lower Shroud D2 (Starboard)', category: 'Shrouds' },
  chainplate_port:  { label: 'Chainplate (Port)', category: 'Hardware' },
  chainplate_stbd:  { label: 'Chainplate (Starboard)', category: 'Hardware' },
  spreader_1_port:  { label: 'Spreader L1 (Port)', category: 'Hardware' },
  spreader_1_stbd:  { label: 'Spreader L1 (Starboard)', category: 'Hardware' },
  mast_step:        { label: 'Mast Step', category: 'Mast' },
  mast_head:        { label: 'Masthead Fittings', category: 'Mast' },
  tang_port:        { label: 'Tang (Port)', category: 'Fittings' },
  tang_stbd:        { label: 'Tang (Starboard)', category: 'Fittings' },
  toggle_port:      { label: 'Toggle (Port)', category: 'Fittings' },
  toggle_stbd:      { label: 'Toggle (Starboard)', category: 'Fittings' },
}

export const WIRE_TYPES = ['1x19 Wire', 'Rod', 'Dyform', 'PBO', 'Dyneema', 'Compacted Strand', 'Other']
export const WIRE_MATERIALS = ['316 SS', 'Nitronic 50', '17-4PH SS', 'PBO', 'Carbon', 'Titanium', 'Other']
export const TURNBUCKLE_TYPES = ['Open Body', 'Closed Body', 'T-Bolt', 'Hydraulic', 'Other']

export const CONDITION_RATINGS = [
  { value: 5, label: 'Like New', color: 'green' },
  { value: 4, label: 'Good', color: 'green' },
  { value: 3, label: 'Fair', color: 'amber' },
  { value: 2, label: 'Poor - Monitor', color: 'amber' },
  { value: 1, label: 'Replace Now', color: 'red' },
]

// ─── Running Rigging Constants ───

export const RUNNING_RIGGING_LINES = {
  main_halyard:  { label: 'Main Halyard', category: 'Halyards' },
  jib_halyard:   { label: 'Jib Halyard', category: 'Halyards' },
  spin_halyard:  { label: 'Spinnaker Halyard', category: 'Halyards' },
  main_sheet:    { label: 'Main Sheet', category: 'Sheets' },
  jib_sheets:    { label: 'Jib Sheets', category: 'Sheets' },
  spin_sheets:   { label: 'Spinnaker Sheets', category: 'Sheets' },
  vang:          { label: 'Vang / Kicker', category: 'Controls' },
  cunningham:    { label: 'Cunningham', category: 'Controls' },
  outhaul:       { label: 'Outhaul', category: 'Controls' },
  backstay_adj:  { label: 'Backstay Adjuster', category: 'Controls' },
  traveler:      { label: 'Traveler Lines', category: 'Controls' },
  reef_1:        { label: '1st Reef Line', category: 'Reef' },
  reef_2:        { label: '2nd Reef Line', category: 'Reef' },
  reef_3:        { label: '3rd Reef Line', category: 'Reef' },
  topping_lift:  { label: 'Topping Lift', category: 'Other' },
  foreguy:       { label: 'Foreguy / Twing', category: 'Other' },
}

export const LINE_MATERIALS = ['Dyneema', 'Vectran', 'Polyester', 'Spectra', 'Technora', 'PBO', 'Nylon', 'Polypropylene', 'Other']
export const LINE_CONSTRUCTIONS = ['Double Braid', 'Single Braid', '3-Strand', 'Covered Core', 'Other']
export const SPLICE_TYPES = ['Eye', 'Brummel', 'Class 2 Cover', 'Tapered', 'Locking', 'None', 'Other']
export const REPLACEMENT_RECS = [
  { value: 'now', label: 'Replace Now', color: 'red' },
  { value: '6_months', label: 'Within 6 Months', color: 'amber' },
  { value: '12_months', label: 'Within 12 Months', color: 'amber' },
  { value: 'ok', label: 'OK for Now', color: 'green' },
]
export const HARDWARE_TYPES = ['Block', 'Clutch', 'Winch', 'Car', 'Track', 'Shackle', 'Snap Shackle', 'Pad Eye', 'Cleat', 'Organizer', 'Other']

// ─── Sail Repair Constants ───

export const DAMAGE_TYPES = ['Tear', 'UV Damage', 'Chafe', 'Seam Failure', 'Batten Pocket', 'Grommet', 'Delamination', 'Mildew', 'Distortion', 'Other']
export const REPAIR_TYPES = ['Patch', 'Re-stitch', 'Panel Replace', 'Tape', 'Adhesive', 'Re-cut', 'Reinforcement', 'None Needed', 'Other']
export const CLOTH_TYPES = ['Woven Dacron', 'Laminate', '3Di', 'Pentex', 'Carbon', 'Mylar', 'Nylon', 'Other']
export const BATTEN_TYPES = ['Fiberglass', 'Carbon', 'Tapered', 'Full Length', 'Partial', 'None']

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
