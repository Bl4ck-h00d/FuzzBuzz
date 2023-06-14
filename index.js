import BitapSearch from "./search/index";

const finder = new BitapSearch(
  "dummy",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
);

const result = finder.search();

console.log(result);

export default BitapSearch