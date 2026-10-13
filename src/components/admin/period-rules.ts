export type BatchRecord = { batch: string; country: string; tracking: string; bill: boolean; status: string; calculated: boolean; laba?: number; admin: string; nyelem: number; rekap: number };

const arrivedStatuses = ["Arrive Indonesia", "Arrive Admin", "Done"];
/** Batch is in Indonesia (or later) per tracking. */
export function arrivedIna(b: { tracking: string }) {
  return arrivedStatuses.includes(b.tracking);
}
/** Laba GO: net profit must be calculated, and tracking must be Done / Arrived INA / tagihan checked. */
export function eligibleProfitBatch(b: { tracking: string; bill: boolean; calculated: boolean; laba?: number }) {
  return b.calculated === true && typeof b.laba === "number" && (arrivedIna(b) || b.bill);
}
/** Admin fee rows can only be pulled from batches that arrived in Indonesia. */
export function eligibleFeeBatch(b: { tracking: string }) {
  return arrivedIna(b);
}
export function summarizeFees(rows: { nyelem: string | number; rekap: string | number }[]) {
  return rows.reduce((sum, row) => sum + (Number(row.nyelem) || 0) + (Number(row.rekap) || 0), 0);
}
/** Harga Bersih JP (Rupiah) = total harga yen × rate yen. */
export function jpNetRupiah(totalYen: number, rateYen: number) {
  return Math.round((Number(totalYen) || 0) * (Number(rateYen) || 0));
}
/** Selisih = total harga jual − total harga TF seller. */
export function sellingDifference(totalJual: number, totalTf: number) {
  return (Number(totalJual) || 0) - (Number(totalTf) || 0);
}

export const batchRecords: BatchRecord[] = [
  { batch: "CH-022", country: "CH", tracking: "Done", bill: true, status: "Closed", calculated: true, laba: 185400, admin: "Ira", nyelem: 10000, rekap: 15000 },
  { batch: "KR-017", country: "KR", tracking: "Arrive Indonesia", bill: false, status: "Closed", calculated: true, laba: 142832, admin: "Ira", nyelem: 5000, rekap: 15000 },
  { batch: "JP-012", country: "JP", tracking: "Arrive Admin", bill: true, status: "Closed", calculated: true, laba: 99000, admin: "Nadia", nyelem: 12000, rekap: 15000 },
  { batch: "TH-009", country: "TH", tracking: "OTW Indonesia", bill: true, status: "Closed", calculated: true, laba: 76500, admin: "Salsa", nyelem: 8000, rekap: 15000 },
  { batch: "JP-014", country: "JP", tracking: "Arrive Indonesia", bill: false, status: "Closed", calculated: false, admin: "Nadia", nyelem: 12000, rekap: 20000 },
  { batch: "CH-025", country: "CH", tracking: "Arrive Warehouse", bill: false, status: "Open", calculated: false, admin: "Nadia", nyelem: 10000, rekap: 20000 },
];
