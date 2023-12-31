import getScore from "./getScore";
import { WORD_SIZE } from "./constant";

const fuzzySearch = (text, pattern, bitMaskTable, options) => {
  const { location, matchDistance, matchThreshold } = options;

  if (pattern.length > WORD_SIZE) {
    throw new Error("Pattern too long to search for");
  }

  const patternSize = pattern.length;
  const textSize = text.length;

  // If location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textSize));

  // Highest score beyond which we give up
  let scoreThreshold = matchThreshold;

  // nearby exact match (optimization)
  let bestLocation = text.indexOf(pattern, expectedLocation);

  if (bestLocation != -1) {
    scoreThreshold = Math.min(
      getScore(pattern, {
        errors: 0,
        currentLocation: bestLocation,
        expectedLocation,
        matchDistance,
      }),
      scoreThreshold
    );

    // in other direction (optimization)
    bestLocation = text.lastIndexOf(pattern, location + patternSize);
    if (bestLocation != -1) {
      scoreThreshold = Math.min(
        getScore(pattern, {
          errors: 0,
          currentLocation: bestLocation,
          expectedLocation,
          matchDistance,
        }),
        scoreThreshold
      );
    }
  }

  //final match state
  const matchMask = 1 << (patternSize - 1);
  bestLocation = -1;
  let finalScore = 1;
  let binMax = patternSize + textSize;
  let lastBitArr = [];
  let possibleMatches = [];

  for (let i = 0; i < patternSize; i += 1) {
    // Scan for the best match; each iteration allows for one or more error
    // Run a binary search to determine ho far from 'location' we can stray at this error level

    let binMin = 0;
    let binMid = binMax;

    while (binMin < binMid) {
      // score at this error level

      const currentScore = getScore(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        matchDistance,
      });

      // search further
      if (currentScore <= scoreThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }
      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as maximum for next.
    binMax = binMid;
    // search range (left from loc)
    let start = Math.max(1, expectedLocation - binMid + 1);
    // search range (right from loc)
    let end = Math.min(expectedLocation + binMid, textSize) + patternSize;

    // Initialize bit array
    let bitArr = Array(end + 2);
    bitArr[end + 1] = (1 << i) - 1;

    for (let j = end; j >= start; j -= 1) {
      let charMask = 0;
      // Out of range
      if (textSize <= j - 1) {
        charMask = 0;
      } else {
        charMask = bitMaskTable[text.charAt(j - 1)];
      }

      // Exact match (zero error) - first pass

      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMask;

      if (i) {
        // Fuzzy match (subsequent pass)
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & matchMask) {
        // console.log(text.slice(j - 1, j - 1 + patternSize));
        finalScore = getScore(pattern, {
          errors: i,
          currentLocation: j - 1,
          expectedLocation,
          matchDistance,
        });
        possibleMatches = [
          ...possibleMatches,
          {
            score: finalScore,
            match: text.slice(j - 1, j - 1 + patternSize),
          },
        ];

        // subsequently better match
        if (finalScore <= scoreThreshold) {
          scoreThreshold = finalScore;
          bestLocation = j - 1;

          if (bestLocation > location) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * location - bestLocation);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }

    if (
      getScore(pattern, {
        errors: i + 1,
        currentLocation: location,
        expectedLocation,
        matchDistance,
      }) > scoreThreshold
    )
      break;

    lastBitArr = bitArr;
  }
  const result = {
    isMatch: bestLocation >= 0,
    score: Math.max(0.001, finalScore),
    bestLocation,
    possibleMatches,
  };
  console.log(
    "Match => ",
    text.slice(bestLocation, bestLocation + patternSize)
  );
  console.log("Possible Matches => ",possibleMatches);
  return result;
};

export default fuzzySearch;
