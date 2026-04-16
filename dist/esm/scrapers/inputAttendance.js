import { changeMonthView, getDateText, hasCheckMark } from '../attendance-utils';
import { convertPlainDateToHeaderDate, parseDayMonthYear } from '../date-utils';
/**
 * Adds a pasted list of names into the attendance record for a given date.
 * @param dateText string - e.g. "12 Apr 2026"
 * @param rawNames string - multiline string of names
 */
function addManualAttendance(dateText, rawNames) {
    if (!dateText)
        throw new Error('dateText is required');
    if (!rawNames.trim())
        return;
    changeMonthView(dateText);
    const dateIndex = Array.from({ length: 5 }).findIndex((_, index) => getDateText(index) === convertPlainDateToHeaderDate(parseDayMonthYear(dateText)));
    if (dateIndex === -1)
        throw new Error('Could not find specified date');
    // Parse names (remove blanks, trim whitespace)
    const namesToRecord = new Set(rawNames
        .split('\n')
        .map((n) => n.trim())
        .filter(Boolean));
    if (namesToRecord.size === 0)
        return;
    const badNames = new Set();
    let previousName = null;
    document.querySelectorAll('tbody:first-of-type > tr').forEach((rowElement) => {
        const name = rowElement.querySelector('td')?.innerText.trim();
        if (!name)
            return;
        if (name === previousName) {
            badNames.add(name);
        }
        previousName = name;
    });
    document.querySelectorAll('tbody:first-of-type > tr').forEach((rowElement) => {
        const [nameCell, _gender, ...dateCells] = rowElement.querySelectorAll('td');
        const name = nameCell?.innerText.trim();
        if (!name)
            return;
        if (badNames.has(name))
            return;
        const dateCell = dateCells[dateIndex];
        if (namesToRecord.has(name))
            if (dateCell && !hasCheckMark(dateCell) && namesToRecord.has(name)) {
                dateCell.querySelector('button')?.click();
            }
    });
    const badNamesToRecord = badNames.intersection(namesToRecord);
    if (badNamesToRecord.size > 0)
        throw new Error(`The following names were not recorded because there are multiple people with these names! ${Array.from(badNamesToRecord).join('; ')}`);
}
function getMostRecentSunday() {
    const today = Temporal.Now.plainDateISO();
    const dayOfWeek = today.dayOfWeek; // 1 = Monday … 7 = Sunday
    // If today is Sunday, return today.
    if (dayOfWeek === 7)
        return today;
    // Otherwise subtract (dayOfWeek) days to get back to Sunday.
    return today.subtract({ days: dayOfWeek });
}
if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    const todayOrRecentSunday = getMostRecentSunday().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    try {
        const rawNames = prompt('Enter list of names')?.trim();
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to default to todayOrRecentSunday when empty string
        const dateText = prompt(`Enter the date`, todayOrRecentSunday)?.trim() || todayOrRecentSunday;
        if (!rawNames)
            throw new Error('No names entered.');
        addManualAttendance(dateText, rawNames);
        alert('All names have been recorded. Please wait for the checkboxes to settle.');
    }
    catch (err) {
        alert(String(err));
        console.error(err);
    }
}
