import { wordList } from "src/data/wordList";

export const encodeUint8ArrayToWord = (bytes: Uint8Array) => {
  const placeValue = generatePlaceValues(bytes.length, 256);
  const bigintValue = computeInteger(placeValue, [...bytes]);
  const digits = bigIntegerToDigits(bigintValue, wordList.length);
  return digitsToWord(digits);
};

export const decodeWordToUint8Array = (words: string) => {
  const digits = wordToDigit(words);
  const placeValue = generatePlaceValues(digits.length, wordList.length);
  const bigintValue = computeInteger(placeValue, digits);
  const byteDigits = bigIntegerToDigits(bigintValue, 256);
  return byteDigits;
};
export const isValidEncoding = (text: string) => {
  const words = text.split(" ");
  if (words.length < 10) return false;

  for (let i = 0; i < words.length; i++) {
    const validWord = wordList.includes(words[i]);
    if (!validWord) return false;
  }
  return true;
};

function generatePlaceValues(numDigits: number, base: number) {
  let placeValues = [];
  for (let index = 0; index < numDigits; index++) {
    let place = numDigits - 1 - index;
    let placeValue = generatePlaceValue(place, base);
    placeValues.push(placeValue);
  }
  return placeValues;
}

function generatePlaceValue(place: number, base: number) {
  let placeValue = BigInt(1);
  if (place <= 0) {
    return placeValue;
  }
  for (let i = 1; i <= place; i++) {
    placeValue = BigInt(base) * placeValue;
  }
  return placeValue;
}

function computeInteger(placeValues: bigint[], digits: number[]) {
  let working = BigInt(0);
  digits.forEach((digit, index) => {
    let digitBigInt = BigInt(digit);
    let placeValue = placeValues[index];
    let value = digitBigInt * placeValue;
    working += value;
  });
  return working;
}

function bigIntegerToDigits(integer: bigint, base: number) {
  if (integer === 0n) {
    return [0];
  }

  let result = [];
  let numDigits = computeNumDigits(integer, base);
  let placeValues = generatePlaceValues(numDigits, base);

  let working = integer;
  for (let placeValue of placeValues) {
    let digit = working / placeValue;
    working %= placeValue;
    result.push(Number(digit));
  }

  while (result[0] === 0) {
    result.shift();
  }

  return result;
}

function computeNumDigits(integer: bigint, base: number) {
  let numDigits = 0;
  let working = integer;

  while (working > 0n) {
    working /= BigInt(base);
    numDigits++;
  }

  return numDigits;
}

const wordToDigit = (text: string) => {
  const digits = text.split(" ").map((word) => wordList.indexOf(word));
  return digits;
};
const digitsToWord = (digits: number[]) => {
  return digits.map((x: number) => wordList[x]).join(" ");
};
