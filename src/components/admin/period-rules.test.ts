import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { eligibleFeeBatch, eligibleProfitBatch, jpNetRupiah, sellingDifference, summarizeFees } from "./period-rules";
describe("period rules", () => {
  test("laba GO includes calculated batches that are Done, arrived INA, or tagihan checked", () => {
    assert.equal(eligibleProfitBatch({ tracking: "Done", bill: false, calculated: true, laba: 1 }), true);
    assert.equal(eligibleProfitBatch({ tracking: "Arrive Indonesia", bill: false, calculated: true, laba: 1 }), true);
    assert.equal(eligibleProfitBatch({ tracking: "OTW Indonesia", bill: true, calculated: true, laba: 1 }), true);
    assert.equal(eligibleProfitBatch({ tracking: "OTW Indonesia", bill: false, calculated: true, laba: 1 }), false);
    assert.equal(eligibleProfitBatch({ tracking: "Done", bill: true, calculated: false }), false);
  });
  test("admin fee rows only come from batches arrived in INA", () => {
    assert.equal(eligibleFeeBatch({ tracking: "Arrive Indonesia" }), true);
    assert.equal(eligibleFeeBatch({ tracking: "Arrive Warehouse" }), false);
  });
  test("period salary sums nyelem and rekap", () => {
    assert.equal(summarizeFees([{ nyelem: 5000, rekap: 15000 }, { nyelem: 10000, rekap: 15000 }]), 45000);
  });
  test("harga bersih JP = total yen x rate", () => {
    assert.equal(jpNetRupiah(1000, 108), 108000);
  });
  test("selisih = harga jual - harga TF seller", () => {
    assert.equal(sellingDifference(500000, 420000), 80000);
  });
});
