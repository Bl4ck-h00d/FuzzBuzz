import WORD_SIZE from "./constant";
import generateBitmaskForPatternCharacters from "./bitmaskTable";

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
    options = { matchThreshold: 0.5, matchDistance: 100, location: 0 }
  ) {
    this.pattern = pattern.toLowerCase();
    this.text = text.toLowerCase();
    this.__chunks = [];

    if (!this.pattern.lenght) {
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
              
          }
      }
  }
}
