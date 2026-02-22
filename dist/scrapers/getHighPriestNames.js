// This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng specifically filtered to High Priests
// Copy the result and paste into Google Sheets
const headings = Array.from(document.querySelectorAll('thead > tr > th')).map((th) => th.textContent?.trim());
const columnsWanted = ['Name'];
const columnIndexes = columnsWanted.map((column) => headings.findIndex((heading) => heading === column));
const nameIndex = columnIndexes[0];
const data = [...document.querySelectorAll('tbody > tr')].map((node) => {
    const name = [...node.children[nameIndex].querySelectorAll('span')].at(-1)?.textContent?.trim();
    return { name };
});
console.log(data.map((row) => Object.values(row).join('\t')).join('\n'));
export {};
