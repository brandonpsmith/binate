import os from "os";
import test from "ava";
import * as binate from "../src/main.js";

const endianness = os.endianness();

function getUnsignedBuffer(num, length) {
  const buffer = Buffer.alloc(length);
  buffer[`writeUInt${endianness}`](num, 0, length);
  return buffer;
}

function readUInt(t, buffer, num, length) {
  const bytes = binate.Bytes({ data: buffer });
  t.is(bytes.readUInt(length), num, `should return ${num}`);
  t.is(bytes.getOffset(), length, `offset should return ${length}`);
}

test("read 1 unsigned byte (shorthand)", async function(t) {
  const num = 255;
  const length = 1;
  const bytes = binate.Bytes({ data: getUnsignedBuffer(num, length) });
  t.is(bytes.readUByte(), num, `value should return ${num}`);
  t.is(bytes.getOffset(), length, `offset should return ${length}`);
});

test("read 1 unsigned byte", async function(t) {
  const num = 255;
  const length = 1;
  readUInt(t, getUnsignedBuffer(num, length), num, length);
});

test("read 2 unsigned bytes", async function(t) {
  const num = 65535;
  const length = 2;
  readUInt(t, getUnsignedBuffer(num, length), num, length);
});

test("read 3 unsigned bytes", async function(t) {
  const num = 16777215;
  const length = 3;
  readUInt(t, getUnsignedBuffer(num, length), num, length);
});

test("read 4 unsigned bytes", async function(t) {
  const num = 4294967295;
  const length = 4;
  readUInt(t, getUnsignedBuffer(num, length), num, length);
});

test("read 5 unsigned bytes", async function(t) {
  const num = 1099511627775;
  const length = 5;
  readUInt(t, getUnsignedBuffer(num, length), num, length);
});

test("read 6 unsigned bytes", async function(t) {
  const num = 281474976710655;
  const length = 6;
  readUInt(t, getUnsignedBuffer(num, length), num, length);
});

test("read 7 unsigned bytes", async function(t) {
  const num = "72057594037927935";
  const length = 7;
  readUInt(t, Buffer.alloc(length, 255), num, length);
});

test("read 8 unsigned bytes", async function(t) {
  const num = "18446744073709551615";
  const length = 8;
  readUInt(t, Buffer.alloc(length, 255), num, length);
});
