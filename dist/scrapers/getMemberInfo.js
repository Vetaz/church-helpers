"use strict";
// This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng
// Copy the result and paste into Google Sheets
const headings = Array.from(document.querySelectorAll('thead > tr > th')).map((th) => th.textContent?.trim());
const columnsWanted = ['Name', 'Gender', 'Birth Date', 'Address'];
const columnIndexes = columnsWanted.map((column) => headings.findIndex((heading) => heading === column));
const nameIndex = columnIndexes[0];
const genderIndex = columnIndexes[1];
const birthDateIndex = columnIndexes[2];
const addressIndex = columnIndexes[3];
const data = [...document.querySelectorAll('tbody > tr')].map((node) => {
    const name = node.children[nameIndex].querySelector('span')?.textContent;
    const profileLink = node.children[nameIndex].querySelector('a')?.href;
    const gender = node.children[genderIndex].textContent;
    const birthDate = node.children[birthDateIndex].textContent;
    const address = node.children[addressIndex].innerHTML.replaceAll('<br>', ', ');
    return { name, profileLink, gender, birthDate, address };
});
console.log(data.map((row) => Object.values(row).join('\t')).join('\n'));
