import type { Record } from './types';

const STORAGE_KEY = 'intimacy_records';

export function loadRecords(): Record[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: Record[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record: Record): Record[] {
  const records = loadRecords();
  const updated = [record, ...records].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  saveRecords(updated);
  return updated;
}

export function deleteRecord(id: string): Record[] {
  const records = loadRecords().filter((r) => r.id !== id);
  saveRecords(records);
  return records;
}
