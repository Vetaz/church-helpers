// src/utils.ts
function consoleLogCsv(data2) {
  console.log(data2.map((row) => Object.values(row).join("	")).join("\n"));
}
function downloadCsv(data2, filename) {
  const csvContent = Object.keys(data2[0]).join(",") + "\n" + data2.map(
    (row) => Object.values(row).map((value) => `"${value ?? ""}"`).join(",")
  ).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
