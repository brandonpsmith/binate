import os from "os";
import test from "ava";
import * as binate from "../src/main.js";

const endianness = os.endianness();

function getSignedBuffer(num, length) {
  const buffer = Buffer.alloc(length);
  buffer[`writeInt${endianness}`](num, 0, length);
  return buffer;
}

function readInt(t, buffer, num, length) {
  const bytes = binate.Bytes({ data: buffer });
  t.is(bytes.readInt(length), num, `value should return ${num}`);
  t.is(bytes.getOffset(), length, `offset should return ${length}`);
}

test("read min 1 signed byte (shorthand)", async function(t) {
  const num = -Math.abs(128);
  const length = 1;
  const bytes = binate.Bytes({ data: getSignedBuffer(num, length) });
  t.is(bytes.readByte(), num, `value should return ${num}`);
  t.is(bytes.getOffset(), length, `offset should return ${length}`);
});

test("read max 1 signed byte (shorthand)", async function(t) {
  const num = 127;
  const length = 1;
  const bytes = binate.Bytes({ data: getSignedBuffer(num, length) });
  t.is(bytes.readByte(), num, `value should return ${num}`);
  t.is(bytes.getOffset(), length, `offset should return ${length}`);
});

test("read min 1 signed byte", async function(t) {
  const num = -Math.abs(128);
  const length = 1;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read max 1 signed byte)", async function(t) {
  const num = 127;
  const length = 1;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read min 2 signed bytes", async function(t) {
  const num = -Math.abs(32768);
  const length = 2;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read max 2 signed bytes", async function(t) {
  const num = 32767;
  const length = 2;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read min 3 signed bytes", async function(t) {
  const num = -Math.abs(8388608);
  const length = 3;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read max 3 signed bytes", async function(t) {
  const num = 8388607;
  const length = 3;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read min 4 signed bytes", async function(t) {
  const num = -Math.abs(2147483648);
  const length = 4;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read max 4 signed bytes", async function(t) {
  const num = 2147483647;
  const length = 4;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read min 5 signed bytes", async function(t) {
  const num = -Math.abs(549755813888);
  const length = 5;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read max 5 signed bytes", async function(t) {
  const num = 549755813887;
  const length = 5;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read min 6 signed bytes", async function(t) {
  const num = -Math.abs(140737488355328);
  const length = 6;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read max 6 signed bytes", async function(t) {
  const num = 140737488355327;
  const length = 6;
  readInt(t, getSignedBuffer(num, length), num, length);
});

test("read min 7 signed bytes", async function(t) {
  const num = "-36028797018963968";
  const length = 7;
  readInt(t, Buffer.from("00000000000080", "hex"), num, length);
});

test("read max 7 signed bytes", async function(t) {
  const num = "36028797018963967";
  const length = 7;
  readInt(t, Buffer.from("FFFFFFFFFFFF7F", "hex"), num, length);
});

test("read min 8 signed bytes", async function(t) {
  const num = "-9223372036854775808";
  const length = 8;
  readInt(t, Buffer.from("0000000000000080", "hex"), num, length);
});

test("read max 8 signed bytes", async function(t) {
  const num = "9223372036854775807";
  const length = 8;
  readInt(t, Buffer.from("FFFFFFFFFFFFFF7F", "hex"), num, length);
});
