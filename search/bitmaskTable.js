/**
 * Say, pattern = "ababc"
 *
 * bitmask table-
 * bitmask["a"]=10100
 * bitmask["b"]=01010
 * bitmask["c"]=00001
 *
 */

const generateBitmaskForPatternCharacters = (pattern) => {
  let bitmaskTable = {};

  for (const char of pattern) {
    bitmaskTable[char] = 0;
  }

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern.charAt(i);
    bitmaskTable[char] |= 1 << (pattern.length - i - 1);
  }

  return bitmaskTable;
};

export default generateBitmaskForPatternCharacters;
