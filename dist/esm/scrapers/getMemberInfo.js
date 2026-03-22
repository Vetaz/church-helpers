import { consoleLogCsv } from '../utils';
//! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng
//! Copy the result and paste into Google Sheets
export function getMemberInfo() {
    // Load all data by scrolling to the bottom
    window.scrollTo(0, document.body.scrollHeight);
    const headings = Array.from(document.querySelectorAll('thead > tr > th')).map((th) => th.innerText);
    const findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
    const nameIndex = findColumnIndex('Name');
    const genderIndex = findColumnIndex('Gender');
    const birthDateIndex = findColumnIndex('Birth Date');
    const addressIndex = findColumnIndex('Address');
    const data = [...document.querySelectorAll('tbody > tr')].map((node) => {
        const name = [...node.children[nameIndex].querySelectorAll('span')].at(-1)?.textContent?.trim();
        const profileLink = node.children[nameIndex].querySelector('a')?.href;
        const gender = node.children[genderIndex].textContent;
        const birthDate = node.children[birthDateIndex].textContent;
        const address = node.children[addressIndex].innerHTML.replaceAll('<br>', ', ');
        return { name, profileLink, gender, birthDate, address };
    });
    const waitTimeMs = 3_000;
    console.log(`Waiting ${waitTimeMs / 1000} seconds for all data to load...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, waitTimeMs);
    });
}
// For direct use in console
getMemberInfo().then(consoleLogCsv);
