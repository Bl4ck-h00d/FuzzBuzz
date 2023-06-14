## About

Fuzz Buzz is a lightweight fuzzy string matching library. It looks for a pattern within a larger text. This
implementation of match is fuzzy, meaning it can find a match even if the pattern contains errors and doesn't
exactly match what is found in the text. This implementation also accepts an expected location, near which the
match should be found. The candidate matches are scored based on a) the number of spelling differences between
the pattern and the text and b) the distance between the candidate match and the expected location. The match
distance parameter sets the relative importance of these two metrics.
        
### Checkout the playground @ [fuzzbuzz-playground](https://bl4ck-h00d.github.io/FuzzBuzz/)

This library implements [Bitap matching algorithm](https://neil.fraser.name/writing/patch/bitap.ps)

### References
* https://github.com/google/diff-match-patch