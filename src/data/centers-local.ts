export interface CenterType {
  id: number;
  name: string;
  created_at: string;
}

export interface QuranCenter {
  id: number;
  created_at: string;
  center_type_id: number;
  city: string;
  name: string;
  created_by: number;
  location: string;
  approval: boolean;
  approval_by: number | null;
  approval_at: string | null;
  softdelete: boolean;
}

export interface UserCenter {
  id: number;
  quran_center_id: number;
  user_id: number;
}

type DbShape = {
  centerTypes: CenterType[];
  quranCenters: QuranCenter[];
  userCenters: UserCenter[];
};

const STORAGE_KEY = "quran_admin_fake_centers_v1";

const seed: DbShape = {
  centerTypes: [
    { id: 1, name: "Masjid Center", created_at: "2026-03-01 10:15:00" },
    { id: 2, name: "Online Academy", created_at: "2026-03-05 14:30:00" },
    { id: 3, name: "Community School", created_at: "2026-03-12 09:10:00" },
  ],
  quranCenters: [
    {
      id: 1,
      center_type_id: 1,
      city: "Lahore",
      name: "Noor Quran Center",
      created_by: 2,
      location: "Johar Town Block A",
      approval: true,
      approval_by: 1,
      approval_at: "2026-03-10 11:10:00",
      softdelete: false,
      created_at: "2026-03-08 09:00:00",
    },
    {
      id: 2,
      center_type_id: 2,
      city: "Karachi",
      name: "Huda Online Quran",
      created_by: 3,
      location: "DHA Phase 6",
      approval: false,
      approval_by: null,
      approval_at: null,
      softdelete: false,
      created_at: "2026-03-14 15:40:00",
    },
  ],
  userCenters: [
    { id: 1, quran_center_id: 1, user_id: 10 },
    { id: 2, quran_center_id: 1, user_id: 11 },
    { id: 3, quran_center_id: 2, user_id: 12 },
  ],
};

function now() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function readDb(): DbShape {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return deepClone(seed);
  }

  try {
    const parsed = JSON.parse(raw) as DbShape;
    if (!parsed.centerTypes || !parsed.quranCenters || !parsed.userCenters) {
      throw new Error("Invalid shape");
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return deepClone(seed);
  }
}

function writeDb(db: DbShape) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function nextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

export function getCenterTypes() {
  return deepClone(readDb().centerTypes);
}

export function getCenterType(id: number) {
  return getCenterTypes().find((x) => x.id === id) ?? null;
}

export function createCenterType(payload: { name: string }) {
  const db = readDb();
  const row: CenterType = {
    id: nextId(db.centerTypes),
    name: payload.name.trim(),
    created_at: now(),
  };
  db.centerTypes.push(row);
  writeDb(db);
  return deepClone(row);
}

export function updateCenterType(id: number, payload: { name: string }) {
  const db = readDb();
  const row = db.centerTypes.find((x) => x.id === id);
  if (!row) return null;
  row.name = payload.name.trim();
  writeDb(db);
  return deepClone(row);
}

export function deleteCenterType(id: number) {
  const db = readDb();
  db.centerTypes = db.centerTypes.filter((x) => x.id !== id);
  writeDb(db);
}

export function getQuranCenters() {
  return deepClone(readDb().quranCenters);
}

export function getQuranCenter(id: number) {
  return getQuranCenters().find((x) => x.id === id) ?? null;
}

export function createQuranCenter(
  payload: Omit<QuranCenter, "id" | "created_at" | "approval_at">
) {
  const db = readDb();
  const row: QuranCenter = {
    ...payload,
    id: nextId(db.quranCenters),
    created_at: now(),
    approval_at: payload.approval ? now() : null,
  };
  db.quranCenters.push(row);
  writeDb(db);
  return deepClone(row);
}

export function updateQuranCenter(
  id: number,
  payload: Omit<QuranCenter, "id" | "created_at" | "approval_at">
) {
  const db = readDb();
  const row = db.quranCenters.find((x) => x.id === id);
  if (!row) return null;
  Object.assign(row, payload);
  row.approval_at = payload.approval ? row.approval_at ?? now() : null;
  writeDb(db);
  return deepClone(row);
}

export function deleteQuranCenter(id: number) {
  const db = readDb();
  db.quranCenters = db.quranCenters.filter((x) => x.id !== id);
  db.userCenters = db.userCenters.filter((x) => x.quran_center_id !== id);
  writeDb(db);
}

export function getUserCenters() {
  return deepClone(readDb().userCenters);
}

export function getUserCenter(id: number) {
  return getUserCenters().find((x) => x.id === id) ?? null;
}

export function createUserCenter(payload: Omit<UserCenter, "id">) {
  const db = readDb();
  const row: UserCenter = {
    ...payload,
    id: nextId(db.userCenters),
  };
  db.userCenters.push(row);
  writeDb(db);
  return deepClone(row);
}

export function updateUserCenter(id: number, payload: Omit<UserCenter, "id">) {
  const db = readDb();
  const row = db.userCenters.find((x) => x.id === id);
  if (!row) return null;
  Object.assign(row, payload);
  writeDb(db);
  return deepClone(row);
}

export function deleteUserCenter(id: number) {
  const db = readDb();
  db.userCenters = db.userCenters.filter((x) => x.id !== id);
  writeDb(db);
}
