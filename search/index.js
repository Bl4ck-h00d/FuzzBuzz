import { WORD_SIZE } from "./constant";
import generateBitmaskForPatternCharacters from "./bitmaskTable";
import fuzzySearch from "./fuzzySearch";

// Shift-And algorithm
/**
 * matchThreshold -> Point at which no match is declared (0.0 = perfection, 1.0 = very loose)
 *
 * matchDistance -> How far to search for a match (0 = exact location, 1000+ = broad match)
 *
 * location -> location to search around
 */
class BitapSearch {
  constructor(
    pattern,
    text,
    options = { matchThreshold: 1, matchDistance: 100, location: 0 }
  ) {
    this.pattern = pattern.toLowerCase();
    this.text = text.toLowerCase();
    this.__chunks = [];
    this.options = options;

    if (!this.pattern.length) {
      throw new Error("Pattern cant be empty");
    }

    const addChunk = (pattern, startIndex = 0) => {
      this.__chunks.push({
        pattern,
        bitmaskTable: generateBitmaskForPatternCharacters(pattern),
        startIndex,
      });
    };

    if (pattern.length > WORD_SIZE) {
      throw new Error("Pattern to big to search for");
    } else {
      addChunk(this.pattern);
    }
  }

  search() {
    // Exact match
    if (this.pattern === this.text) {
      let result = {
        isMatch: true,
        score: 0,
      };
      return result;
    }

    // Else use Bitap algorithm

    const { matchThreshold, matchDistance, location } = this.options;

    let hasMatches = false;
    let totalScore = 0;
    let allMatches = [];
    // Loop through chunks to find a match
    this.__chunks.forEach(({ pattern, bitmaskTable, startIndex }) => {
      const { isMatch, score, possibleMatches } = fuzzySearch(
        this.text,
        pattern,
        bitmaskTable,
        {
          location: location + startIndex,
          matchDistance,
          matchThreshold,
        }
      );

      if (isMatch) {
        hasMatches = true;
      }
      totalScore += score;
      if (hasMatches) {
        allMatches = [...allMatches, possibleMatches];
      }
    });

    console.log("Chunks", this.__chunks);

    const result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.__chunks.length : 1,
      ...allMatches,
    };

    return result;
  }
}

export default BitapSearch;
