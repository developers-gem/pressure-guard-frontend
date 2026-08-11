export interface AuthUser {
  id: string;
  name: string;
  email: string;
  credentials?: string;
  role: "staff" | "admin";
}

export interface Patient {
  id: string;
  name: string;
  room: string;
  mrn?: string;
  active: boolean;
  bradenScore?: number;
  bradenRisk?: string;
  lastRepositioned?: string; // ISO date
  lastPosition?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WoundPhoto {
  _id?: string;
  url: string;
  caption?: string;
  bodyLocation?: string;
  timestamp?: string;
}

export interface RepositionLog {
  _id: string;
  patient: string;
  patientName: string;
  position: string;
  staff: string;
  notes?: string;
  timestamp: string;
}

export interface BradenScores {
  sensory: number;
  moisture: number;
  activity: number;
  mobility: number;
  nutrition: number;
  friction: number;
}

export interface BradenAssessment {
  _id: string;
  patient: string;
  patientName: string;
  staff: string;
  scores: BradenScores;
  total: number;
  riskLevel: string;
  timestamp: string;
}

export interface AreaFinding {
  area: string;
  status: string;
  notes?: string;
}

export interface SkinInspection {
  _id: string;
  patient: string;
  patientName: string;
  staff: string;
  areas: AreaFinding[];
  photos: WoundPhoto[];
  timestamp: string;
}

export interface FootAssessment {
  _id: string;
  patient: string;
  patientName: string;
  staff: string;
  side: "Left" | "Right" | "Both";
  wagnerGrade: number;
  size?: string;
  location?: string;
  drainage?: string;
  pulses?: string;
  sensation?: string;
  notes?: string;
  photos: WoundPhoto[];
  timestamp: string;
}

export interface ComplianceSummary {
  patientsTracked: number;
  turnsLogged24h: number;
  overallCompliance24h: number;
  skinInspections7d: number;
  complianceByPatient: { patientId: string; name: string; room: string; turns: number; pct: number }[];
  overdue: { patientId: string; name: string; room: string; minutesSinceLastTurn: number }[];
  highRisk: { patientId: string; name: string; room: string; bradenScore: number; bradenRisk: string }[];
}
