import BitapSearch from "./search/index";

const finder = new BitapSearch(
  "zera",
  "Fuse.js is a powerful, test lightweight fuzzy-search library, with zero dependencies"
);

const result = finder.search();

console.log(result);
