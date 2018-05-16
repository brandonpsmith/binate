import os from "os";
import Long from "long";

// static
export const hex2ascii = hex => {
  if (!hex) {
    return;
  }

  let ascii = '';

  for (let i = 0, len = hex.length; i < len; i += 2) {
    ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return ascii;
}

export const ascii2hex = ascii => {
  if (!ascii) {
    return;
  }

  let hex = '';

  for (let i = 0, len = ascii.length; i < len; i++) {
    let char = ascii.charCodeAt(i).toString(16);
    hex += char.length === 1 ? '0' + char : char;
  }

  return hex;
}

export const bin2dec = bin => {
  return Number(parseInt(Array.isArray(bin) ? bitArrayToBitString(bin) : bin, 2).toString(10));
}

export const dec2bin = dec => {
  return parseInt(Number(dec), 10).toString(2);
}

export const byteToBitArray = byte => {
  if (isNaN(byte)) {
    return;
  }

  if (byte === 0) {
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }

  let bits = [];

  for (let i = 0; i < 8; i++) {
    bits.push((byte >> i) & 1);
  }

  return bits;
}

export const bytesToBitArray = buffer => {
  if (!buffer || buffer.length === 0) {
    return;
  }

  let bits = [];

  for (let i = buffer.length - 1; i >= 0; i--) {
    bits = bits.concat(byteToBitArray(buffer[i]));
  }

  return bits;
}

export const byteToBitString = byte => {
  if (isNaN(byte)) {
    return;
  }

  if (byte === 0) {
    return '00000000';
  }

  let bits = '';

  for (let i = 0; i < 8; i++) {
    bits += ((byte >> i) & 1);
  }

  return bits;
}

export const bytesToBitString = buffer => {
  if (!buffer || buffer.length === 0) {
    return;
  }

  let bits = '';

  for (let i = 0; i < buffer.length; i++) {
    bits = byteToBitString(buffer[i]) + bits;
  }

  return bits;
}

export const bitStringToBitArray = str => {
  const array = [];

  for (let i = 0; i < str.length; i++) {
    array.push(str[i]);
  }

  return array;
}

export const bitArrayToBitString = array => {
  let str = '';

  for (let i = 0; i < array.length; i++) {
    str += array[i];
  }

  return str;
}

function sanitizeEndianness(endianness) {
  const sanitized = endianness.trim().toUpperCase();

  if (sanitized !== 'BE' && sanitized !== 'LE') {
    throw new Error("CPU endianness must be big endian ('BE', 'be') or little endian ('LE', 'le')");
  }

  return sanitized;
}

export const Bits = ({ data, encoding }) => {
  if (!Buffer.isBuffer(data) && !Array.isArray(data) && typeof data !== "string") {
    throw new Error(`The data property must be type of Buffer, Array, or string`);
  } else if (data.length === 0) {
    throw new Error("The data property is required");
  }

  const _array = bytesToBitArray(typeof data === 'string' 
      ? Buffer.from(data, encoding || 'utf8')
      : Buffer.from(data));

  let _offset = 0;

  function getOffset() {
    return _offset;
  }

  function setOffset(num) {
    _offset = num;
  }

  function addOffset(num) {
    _offset += num;
  }

  function readBit() {
    const bit = _array[getOffset()];
    addOffset(1);
    return bit;
  }

  function readBits(bits) {
    if (!bits) {
      return;
    }

    const offset = getOffset();
    let bin = _array.slice(offset, offset + bits);
    addOffset(bits);
    return bin;
  }

  return Object.freeze({
    value: _array,
    getOffset,
    setOffset,
    addOffset,
    readBit,
    readBits
  });
}

export const Bytes = ({ data, encoding, endianness }) => {
  if (!Buffer.isBuffer(data) && !Array.isArray(data) && typeof data !== "string") {
    throw new Error("The data property must be type of Buffer, Array, or string");
  }  else if (data.length === 0) {
    throw new Error("The data property is required");
  }

  const _buffer = typeof data === 'string' 
      ? Buffer.from(data, encoding || 'utf8')
      : Buffer.from(data);

  const _endianness = typeof endianness === 'string' ? sanitizeEndianness(endianness) : os.endianness();

  let _offset = 0;

  function getOffset() {
    return _offset;
  }

  function setOffset(num) {
    _offset = num;
  }

  function addOffset(num) {
    _offset += num;
  }

  function getNumber(name, bytes, unsigned, endianness) {
    if (bytes < 1 || bytes > 8) {
      return;
    }

    const endian = endianness && sanitizeEndianness(endianness) || _endianness;
    const offset = getOffset();

    let number;

    if (name !== 'readDouble' && name !== 'readFloat' && (bytes === 7 || bytes === 8)) {
      const long = Long.fromBytes(_buffer.slice(offset, offset + bytes), unsigned, endian === "LE");
      number = long.toString();

      if (!long.unsigned && long.low === 0 && !number.startsWith("-")) {
        number = "-" + number;
      }
    } else {
      number = _buffer[`${name}${bytes === 1 ? '8' : endian}`](offset, bytes);
    }

    addOffset(bytes);
    return number;
  }

  function readBytes(bytes) {
    if (isNaN(bytes)) {
      return;
    }

    const offset = getOffset();
    const buffer = _buffer.slice(offset, offset + bytes);
    addOffset(bytes);
    return buffer;
  }

  function readHex(bytes) {
    return readBytes(bytes).toString('hex');
  }

  function readASCII(bytes) {
    return readBytes(bytes).toString('ascii');
  }

  function readUTF8(bytes) {
    return readBytes(bytes).toString('utf8');
  }

  function readByte() {
    return readInt(1);
  }

  function readUByte() {
    return readUInt(1);
  }

  function readInt(bytes, endianness) {
    return getNumber('readInt', bytes, false, endianness);
  }

  function readUInt(bytes, endianness) {
    return getNumber('readUInt', bytes, true, endianness);
  }

  function readIntBE(bytes) {
    return readInt(bytes, 'BE');
  }

  function readUIntBE(bytes) {
    return readUInt(bytes, 'BE');
  }

  function readIntLE(bytes) {
    return readInt(bytes, 'LE');
  }

  function readUIntLE(bytes) {
    return readUInt(bytes, 'LE');
  }

  function readFloat(endianness) {
    return getNumber('readFloat', 4, false, endianness);
  }

  function readFloatBE() {
    return readFloat('BE');
  }

  function readFloatLE() {
    return readFloat('LE');
  }

  function readDouble(endianness) {
    return getNumber('readDouble', 8, false, endianness);
  }

  function readDoubleBE() {
    return readDouble('BE');
  }

  function readDoubleLE() {
    return readDouble('LE');
  }

  return Object.freeze({
    value: _buffer,
    getOffset,
    setOffset,
    addOffset,
    readBytes,
    readHex,
    readASCII,
    readUTF8,
    readInt,
    readUInt,
    readByte,
    readUByte,
    readIntBE,
    readUIntBE,
    readIntLE,
    readUIntLE,
    readFloat,
    readFloatBE,
    readFloatLE,
    readDouble,
    readDoubleBE,
    readDoubleLE,
  });
}