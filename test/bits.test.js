import test from "ava";
import * as binate from "../src/main.js";

test("read 1 bit from byte", async function(t) {
  const bits = binate.Bits({ data: Buffer.alloc(1, 255) });
  const value = bits.readBit();
  t.is(value, 1, "value should return 1");
  t.is(bits.getOffset(), 1, "offset should return 1");
});

test("read first 4 bits from byte", async function(t) {
  const bits = binate.Bits({ data: Buffer.alloc(1, 172) });
  const value = bits.readBits(4);
  t.deepEqual(value, [0,0,1,1], "value should return [0,0,1,1]");
  t.is(bits.getOffset(), 4, "offset should return 4");
});

test("read last 4 bits from byte", async function(t) {
  const bits = binate.Bits({ data: Buffer.alloc(1, 172) });
  bits.addOffset(4);
  t.is(bits.getOffset(), 4, "offset should return 4");
  const value = bits.readBits(4);
  t.deepEqual(value, [0,1,0,1], "value should return [0,1,0,1]");
  t.is(bits.getOffset(), 8, "offset should return 8");
});