export type DemoId =
  | "call-sheet-gate"
  | "metrc-recon"
  | "vendor-po-gate"
  | "continuity-look-sync"
  | "standup-digest"
  | "deliverable-board";

export type GateDecision = "pending" | "approved" | "rejected" | "escalated";

export type AuditEvent = {
  id: string;
  demo: DemoId;
  action: string;
  at: string;
  actor: string;
  sent: false;
  summary: string;
  detail?: Record<string, unknown>;
};

export type CastRow = {
  number?: string;
  name: string;
  role?: string;
  call: string;
};

export type CallSheetFields = {
  title: string;
  production: string;
  date: string;
  location: string;
  generalCall: string;
  wrap: string;
  scenes: string;
  talent: CastRow[];
  vanA: string;
  vanB: string;
  notes: string;
  allergies: string;
};

export type ScheduleStub = {
  date: string;
  production: string;
  day_label: string;
  location: string;
  general_call: string;
  talent: { name: string; call: string }[];
  notes: string;
};

export type DiffSeverity = "HIGH" | "MED";

export type DiffRow = {
  id: string;
  field: string;
  before: string;
  after: string;
  changed: boolean;
  severity?: DiffSeverity;
};

export type MetrcRow = {
  plantId?: string;
  packageTag: string;
  item: string;
  quantity: number;
  hold?: boolean;
  uom?: string;
};

export type VarianceRow = {
  plantId: string;
  packageTag: string;
  item: string;
  metrcQty: number | null;
  physicalQty: number | null;
  variance: number | null;
  pct: number | null;
  metrcHold: boolean | null;
  physicalHold: boolean | null;
  holdDrift: boolean;
  status: "match" | "variance" | "metrc-only" | "physical-only";
  reviewOver5: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  role: string;
  status: "active" | "review-removal";
  note: string;
};

export type QuoteLine = {
  sku: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  days: number;
  catalog_rate?: number;
};

export type VendorQuote = {
  vendor: string;
  quote_id: string;
  terms: string;
  currency?: string;
  contact: string;
  lines: QuoteLine[];
  notes?: string;
  coi_on_file?: boolean;
};

export type PoRecommendation = "approve" | "reject" | "escalate";

export type DraftPo = {
  poNumber: string;
  vendor: string;
  quoteId: string;
  terms: string;
  currency: string;
  contact: string;
  lines: (QuoteLine & { ext: number; catalogExt?: number; catalogDeltaPct?: number })[];
  subtotal: number;
  total: number;
  notes: string;
  sent: false;
  emailedVendor: false;
  coiOnFile: boolean;
  recommended: PoRecommendation;
  reason: string;
  flags: string[];
};

export type PoPolicy = {
  approve_under: number;
  dual_escalate_over: number;
  catalog_flag_pct: number;
};

export type ContinuityLook = {
  id: string;
  character: string;
  wardrobe: string;
  hair: string;
  notes: string;
};

export type LookBible = {
  production: string;
  day_label: string;
  locked: true;
  locked_by: string;
  locked_note: string;
  looks: ContinuityLook[];
};

export type SceneStill = {
  id: string;
  scene: string;
  setup: string;
  character: string;
  label: string;
  stub: string;
  capturedAt: string;
};

export type WardrobeNote = {
  id: string;
  dept: string;
  scene: string;
  character: string;
  author: string;
  body: string;
};

export type ContinuityFlag = {
  id: string;
  stillId: string;
  noteId: string;
  lookId: string;
  field: string;
  still: string;
  expected: string;
  severity: DiffSeverity;
  mismatch: boolean;
};

export type DeptStub = {
  id: string;
  dept: string;
  author: string;
  items: string[];
};

export type StandupPack = {
  production: string;
  date: string;
  day_label: string;
  location: string;
  channel: string;
  emailTo: string;
  departments: DeptStub[];
};

export type DigestPreview = {
  slackChannel: string;
  slackBody: string;
  emailFrom: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  held: true;
  sent: false;
};

export type BoardColumnId = "picture-lock" | "m-and-e" | "legal" | "deliverables";

export type DeliverableCard = {
  id: string;
  column: BoardColumnId;
  title: string;
  owner: string;
  status: "ready" | "in-progress" | "waiting" | "blocked";
  lastTouch: string;
  note: string;
  stale: boolean;
  severity: DiffSeverity;
  flag: string;
};

export type DeliverableBoard = {
  production: string;
  cut: string;
  asOf: string;
  columns: { id: BoardColumnId; label: string }[];
  cards: DeliverableCard[];
};
