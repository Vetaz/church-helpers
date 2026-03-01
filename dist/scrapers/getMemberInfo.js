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

// src/scrapers/getMemberInfo.ts
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
consoleLogCsv(data);
