//! Go to https://lcr.churchofjesuschrist.org/mlt/report/members-moved-in?lang=eng
import { consoleLogCsv } from '../utils';
export function getNewMembers() {
    const headings = Array.from(document.querySelectorAll('thead > tr > th')).map((th) => th.innerText.trim());
    const findColumnIndex = (column) => headings.indexOf(column);
    const nameIndex = findColumnIndex('Name');
    const moveInDateIndex = findColumnIndex('Move In Date');
    const rows = Array.from(document.querySelectorAll('tbody > tr'));
    return rows.map((node) => {
        const name = node
            .querySelector(`td:nth-child(${String(nameIndex + 1)}) button`)
            ?.innerText.trim();
        const moveInDte = node
            .querySelector(`td:nth-child(${String(moveInDateIndex + 1)})`)
            ?.innerText.trim();
        return { name, moveInDte };
    });
}
if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    const newMembers = getNewMembers();
    consoleLogCsv(newMembers);
}
