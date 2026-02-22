// This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/mlt/orgs?unitOrgTypeId=70&lang=eng specifically filtered to Members
// Copy the result and paste into Google Sheets
const headings = Array.from(document.querySelectorAll('thead > tr > th')).map((th) => th.innerText);
const findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
const nameIndex = findColumnIndex('Name');
const priesthoodIndex = findColumnIndex('Priesthood');
const data = [...document.querySelectorAll('tbody > tr')].map((node) => {
    const name = node.children[nameIndex].innerText;
    const priesthood = node.children[priesthoodIndex].innerText;
    return { name, priesthood };
});
console.log(data.map((row) => Object.values(row).join('\t')).join('\n'));
export {};
