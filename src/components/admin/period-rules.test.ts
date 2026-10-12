import { describe, expect, test } from "bun:test";
import { eligibleProfitBatch, summarizeFees } from "./period-rules";
describe("period rules", () => {
  test("profit only includes Done batches with calculated net profit", () => {
    expect(eligibleProfitBatch({ status: "Done", laba: 10000, calculated: true })).toBe(true);
    expect(eligibleProfitBatch({ status: "Open", laba: 10000, calculated: true })).toBe(false);
    expect(eligibleProfitBatch({ status: "Done", laba: 10000, calculated: false })).toBe(false);
  });
  test("period salary includes nyelem and rekap for all batch rows and manual edits", () => {
    expect(summarizeFees([{ nyelem: 5000, rekap: 15000 }, { nyelem: 10000, rekap: 15000 }])).toBe(45000);
    expect(summarizeFees([{ nyelem: 10000, rekap: 15000 }, { nyelem: 10000, rekap: 15000 }])).toBe(50000);
  });
});