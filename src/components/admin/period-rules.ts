export function eligibleProfitBatch(batch: { status: string; laba?: number; calculated?: boolean }) {
  return batch.status === "Done" && batch.calculated === true && typeof batch.laba === "number";
}
export function summarizeFees(rows: { nyelem: string | number; rekap: string | number }[]) {
  return rows.reduce((sum, row) => sum + (Number(row.nyelem) || 0) + (Number(row.rekap) || 0), 0);
}