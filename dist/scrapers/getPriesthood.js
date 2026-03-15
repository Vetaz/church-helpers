// src/utils.ts
function consoleLogCsv(data2) {
  console.log(data2.map((row) => Object.values(row).join("	")).join("\n"));
}

// src/scrapers/getPriesthood.ts
//! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/mlt/orgs?unitOrgTypeId=70&lang=eng specifically on the Members tab
//! Copy the result and paste into Google Sheets
var headings = Array.from(document.querySelectorAll("thead > tr > th")).map(
  (th) => th.innerText
);
var findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
var nameIndex = findColumnIndex("Name");
var priesthoodIndex = findColumnIndex("Priesthood");
var data = [...document.querySelectorAll("tbody > tr")].map((node) => {
  const name = node.children[nameIndex].innerText;
  const priesthood = node.children[priesthoodIndex].innerText;
  return { name, priesthood };
});
consoleLogCsv(data);
