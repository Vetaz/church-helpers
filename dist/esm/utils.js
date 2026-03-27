export function consoleLogCsv(data) {
    console.log(data.map((row) => Object.values(row).join('\t')).join('\n'));
}
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
    return {
        day: Number(dayStr),
        month,
        year: yearStr !== undefined ? Number(yearStr) : undefined,
    };
}
export function parseMonthDay(mdStr) {
    const { day, month } = parseParts(mdStr);
    return new Temporal.PlainMonthDay(month, day);
}
export function parseDate(mdStr) {
    const { day, month, year } = parseParts(mdStr);
    if (year === undefined) {
        throw new Error(`Expected a year in date string: ${mdStr}`);
    }
    return new Temporal.PlainDate(year, month, day);
}
