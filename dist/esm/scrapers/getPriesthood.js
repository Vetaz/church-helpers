//! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/mlt/orgs?unitOrgTypeId=70&lang=eng specifically on the Members tab
//! Copy the result and paste into Google Sheets
export function getPriesthood() {
    const headings = Array.from(document.querySelectorAll('thead > tr > th')).map((th) => th.innerText);
    const findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
    const nameIndex = findColumnIndex('Name');
    const priesthoodIndex = findColumnIndex('Priesthood');
    const data = [...document.querySelectorAll('tbody > tr')].map((node) => {
        const name = node.children[nameIndex].innerText;
        const priesthood = node.children[priesthoodIndex].innerText;
        return { name, priesthood };
    });
    return data;
}
export function toCsv(data) {
    return data.map((row) => [row.name, row.priesthood].join('\t')).join('\n');
}
if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    console.log(toCsv(getPriesthood()));
}
