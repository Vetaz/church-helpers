// src/utils.ts
function consoleLogCsv(data2) {
  console.log(data2.map((row) => Object.values(row).join("	")).join("\n"));
}

// src/scrapers/getMemberInfo.ts
//! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng
//! Copy the result and paste into Google Sheets
window.scrollTo(0, document.body.scrollHeight);
var headings = Array.from(document.querySelectorAll("thead > tr > th")).map(
  (th) => th.innerText
);
var findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
var nameIndex = findColumnIndex("Name");
var genderIndex = findColumnIndex("Gender");
var birthDateIndex = findColumnIndex("Birth Date");
var addressIndex = findColumnIndex("Address");
var data = [...document.querySelectorAll("tbody > tr")].map((node) => {
  const name = [...node.children[nameIndex].querySelectorAll("span")].at(-1)?.textContent?.trim();
  const profileLink = node.children[nameIndex].querySelector("a")?.href;
  const gender = node.children[genderIndex].textContent;
  const birthDate = node.children[birthDateIndex].textContent;
  const address = node.children[addressIndex].innerHTML.replaceAll("<br>", ", ");
  return { name, profileLink, gender, birthDate, address };
});
var waitTimeMs = 3e3;
console.log(`Waiting ${waitTimeMs / 1e3} seconds for all data to load...`);
setTimeout(() => {
  consoleLogCsv(data);
}, waitTimeMs);
