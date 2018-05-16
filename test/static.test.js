import test from "ava";
import * as binate from "../src/main.js";

test("convert hex to ascii", async function(t) {
  const hex = "48656c6c6f20576f726c6421";
  const ascii = "Hello World!";
  t.is(binate.hex2ascii(hex), ascii, `value should return ${ascii}`);
});

test("convert ascii to hex", async function(t) {
  const ascii = "Hello World!";
  const hex = "48656c6c6f20576f726c6421";
  t.is(binate.ascii2hex(ascii), hex, `value should return ${hex}`);
});

test("convert binary to decimal", async function(t) {
  const bin = "111010110111100110100010101";
  const dec = 123456789;
  t.is(binate.bin2dec(bin), dec, `value should return ${dec}`);
});

test("convert decimal to binary", async function(t) {
  const dec = 123456789;
  const bin = "111010110111100110100010101";
  t.is(binate.dec2bin(dec), bin, `value should return ${bin}`);
});

test("convert byte to bit array", async function(t) {
  const value = binate.byteToBitArray(240);
  t.deepEqual(value, [0,0,0,0,1,1,1,1], "value should return [0,0,0,0,1,1,1,1]");
});

test("convert bytes to bit array", async function(t) {
  const value = binate.bytesToBitArray([240,240]);
  t.deepEqual(value, [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1], "value should return [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1]");
});

test("convert byte to bit string", async function(t) {
  const value = binate.byteToBitString(240);
  t.is(value, "00001111", "value should return 00001111");
});

test("convert bytes to bit string", async function(t) {
  const value = binate.bytesToBitString([240,240]);
  t.is(value, "0000111100001111", "value should return 0000111100001111");
});
