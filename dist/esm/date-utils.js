function parseParts(mdStr) {
    const [dayStr, monthStr, yearStr] = mdStr.trim().split(' ');
    if (dayStr === undefined || monthStr === undefined) {
        throw new Error(`Invalid date string: ${mdStr}`);
    }
    const monthMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
    };
    function isTrueMonth(monthStr) {
        return monthStr in monthMap;
    }
    if (!isTrueMonth(monthStr)) {
        throw new Error(`Invalid month: ${monthStr}`);
    }
    const month = monthMap[monthStr];
    return { day: Number(dayStr), month, year: yearStr !== undefined ? Number(yearStr) : undefined };
}
/** 05 Apr -> PlainMonthDay */
export function parseMonthDay(mdStr) {
    const { day, month } = parseParts(mdStr);
    return new Temporal.PlainMonthDay(month, day);
}
/** 05 Apr 2026 or 5 Apr 2026 -> PlainDate */
export function parseDayMonthYear(mdStr) {
    const { day, month, year } = parseParts(mdStr);
    if (year === undefined) {
        throw new Error(`Expected a year in date string: ${mdStr}`);
    }
    return new Temporal.PlainDate(year, month, day);
}
/**
 * Parses a date string in "D MMM" format and returns the year based on current date.
 * - If the date (month/day) is on or before today's date in the current year, returns the current year.
 * - Otherwise, returns the previous year.
 * @param dateStr string - Date string like "1 Jan" or "23 Feb"
 * @returns number - The calculated year
 */
export function getYearFromMonthDay(dateStr) {
    const md = parseMonthDay(dateStr);
    const today = Temporal.Now.plainDateISO();
    const thisYearDate = md.toPlainDate({ year: today.year });
    return Temporal.PlainDate.compare(thisYearDate, today) <= 0 ? today.year : today.year - 1;
}
/** Plain Date to header type of date (05 Apr) */
export const convertPlainDateToHeaderDate = (date) => {
    return date.toLocaleString('en-GB', { day: '2-digit', month: 'short' });
};
