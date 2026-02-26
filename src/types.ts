export interface Record {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM
  notes?: string;
  createdAt: string;
}
