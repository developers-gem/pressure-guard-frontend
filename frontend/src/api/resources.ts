import { client } from "./client";
import type {
  AuthUser,
  Patient,
  RepositionLog,
  BradenAssessment,
  BradenScores,
  SkinInspection,
  AreaFinding,
  FootAssessment,
  WoundPhoto,
  ComplianceSummary,
} from "./types";

// ---- Auth ----
export async function login(email: string, password: string) {
  const { data } = await client.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
  return data;
}
export async function register(payload: { name: string; email: string; password: string; credentials?: string }) {
  const { data } = await client.post<{ token: string; user: AuthUser }>("/auth/register", payload);
  return data;
}
export async function fetchMe() {
  const { data } = await client.get<{ user: AuthUser }>("/auth/me");
  return data.user;
}

// ---- Patients ----
export async function listPatients() {
  const { data } = await client.get<Patient[]>("/patients");
  return data;
}
export async function createPatient(payload: { name: string; room?: string; mrn?: string }) {
  const { data } = await client.post<Patient>("/patients", payload);
  return data;
}
export async function updatePatient(id: string, payload: Partial<Patient>) {
  const { data } = await client.patch<Patient>(`/patients/${id}`, payload);
  return data;
}
export async function deletePatient(id: string) {
  await client.delete(`/patients/${id}`);
}

// ---- Repositioning ----
export async function listRepositionLogs(patientId: string) {
  const { data } = await client.get<RepositionLog[]>(`/patients/${patientId}/repositioning`);
  return data;
}
export async function createRepositionLog(
  patientId: string,
  payload: { position: string; staff: string; notes?: string },
) {
  const { data } = await client.post<RepositionLog>(`/patients/${patientId}/repositioning`, payload);
  return data;
}

// ---- Braden ----
export async function listBradenAssessments(patientId: string) {
  const { data } = await client.get<BradenAssessment[]>(`/patients/${patientId}/braden`);
  return data;
}
export async function createBradenAssessment(patientId: string, staff: string, scores: BradenScores) {
  const { data } = await client.post<BradenAssessment>(`/patients/${patientId}/braden`, { staff, scores });
  return data;
}

// ---- Skin inspections ----
export async function listSkinInspections(patientId: string) {
  const { data } = await client.get<SkinInspection[]>(`/patients/${patientId}/skin-inspections`);
  return data;
}
export async function createSkinInspection(
  patientId: string,
  payload: { staff: string; areas: AreaFinding[]; photos: WoundPhoto[] },
) {
  const { data } = await client.post<SkinInspection>(`/patients/${patientId}/skin-inspections`, payload);
  return data;
}

// ---- Foot assessments ----
export async function listFootAssessments(patientId: string) {
  const { data } = await client.get<FootAssessment[]>(`/patients/${patientId}/foot-assessments`);
  return data;
}
export async function createFootAssessment(patientId: string, payload: Omit<FootAssessment, "_id" | "patient" | "patientName" | "timestamp">) {
  const { data } = await client.post<FootAssessment>(`/patients/${patientId}/foot-assessments`, payload);
  return data;
}

// ---- Uploads ----
export async function uploadPhoto(file: File) {
  const form = new FormData();
  form.append("photo", file);
  const { data } = await client.post<{ url: string }>("/uploads", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

// ---- Compliance ----
export async function fetchComplianceSummary() {
  const { data } = await client.get<ComplianceSummary>("/compliance/summary");
  return data;
}
export function exportCsvUrl() {
  return `${client.defaults.baseURL}/compliance/export.csv`;
}
