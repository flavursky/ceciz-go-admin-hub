import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { eligibleFeeBatch, eligibleProfitBatch, grossProfit, jpNetRupiah, netProfit, sellingDifference, summarizeFees, taxDifference } from "./period-rules";
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
  test("selisih tax = tagihan PC - (freebies + CO shopee + tagihan WH)", () => {
    assert.equal(taxDifference(300000, 20000, 50000, 100000), 130000);
  });
  test("laba kotor = selisih tax + selisih harga", () => {
    assert.equal(grossProfit(130000, 80000), 210000);
  });
  test("laba bersih = laba kotor - fee nyelem - fee rekap", () => {
    assert.equal(netProfit(210000, 10000, 15000), 185000);
  });
});
