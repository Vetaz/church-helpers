//! Go to https://lcr.churchofjesuschrist.org/mlt/report/members-moved-in?lang=eng
export function getNewMembersAfterPerson(allMembers) {
    const targetName = prompt('Enter the name of the last new move-in you recorded:')?.trim();
    if (!targetName)
        throw new Error('No name entered.');
    // Find all matches
    const matches = allMembers.filter((m) => m.name === targetName);
    if (matches.length === 0) {
        throw new Error(`No member found with name "${targetName}".`);
    }
    if (matches.length > 1) {
        throw new Error(`Multiple members found with name "${targetName}". Names must be unique.`);
    }
    const target = matches[0];
    if (!target?.moveInDate) {
        throw new Error(`Target member "${targetName}" has no move-in date.`);
    }
    const targetDate = new Date(target.moveInDate);
    // Return only members who moved in AFTER the target
    return allMembers.filter((m) => {
        if (!m.moveInDate)
            return false;
        return new Date(m.moveInDate) > targetDate;
    });
}
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
        const moveInDate = node
            .querySelector(`td:nth-child(${String(moveInDateIndex + 1)})`)
            ?.innerText.trim();
        return { name, moveInDate };
    });
}
export function toCsv(data) {
    return data.map((row) => [row.name, '', '', '', row.moveInDate].join('\t')).join('\n');
}
if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    const allMembers = getNewMembers();
    try {
        const filtered = getNewMembersAfterPerson(allMembers);
        console.log(toCsv(filtered));
    }
    catch (err) {
        alert(String(err));
        console.error(err);
    }
}
