import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { eligibleProfitBatch, summarizeFees } from "./period-rules";
describe("period rules", () => {
  test("profit only includes Done batches with calculated net profit", () => {
    assert.equal(eligibleProfitBatch({ status: "Done", laba: 10000, calculated: true }), true);
    assert.equal(eligibleProfitBatch({ status: "Open", laba: 10000, calculated: true }), false);
    assert.equal(eligibleProfitBatch({ status: "Done", laba: 10000, calculated: false }), false);
  });
  test("period salary includes nyelem and rekap for all batch rows and manual edits", () => {
    assert.equal(summarizeFees([{ nyelem: 5000, rekap: 15000 }, { nyelem: 10000, rekap: 15000 }]), 45000);
    assert.equal(summarizeFees([{ nyelem: 10000, rekap: 15000 }, { nyelem: 10000, rekap: 15000 }]), 50000);
  });
});