/** 05 Apr -> PlainMonthDay */
export declare function parseMonthDay(mdStr: string): Temporal.PlainMonthDay;
/** 05 Apr 2026 or 5 Apr 2026 -> PlainDate */
export declare function parseDayMonthYear(mdStr: string): Temporal.PlainDate;
/**
 * Parses a date string in "D MMM" format and returns the year based on current date.
 * - If the date (month/day) is on or before today's date in the current year, returns the current year.
 * - Otherwise, returns the previous year.
 * @param dateStr string - Date string like "1 Jan" or "23 Feb"
 * @returns number - The calculated year
 */
export declare function getYearFromMonthDay(dateStr: string): number;
/** Plain Date to header type of date (05 Apr) */
export declare const convertPlainDateToHeaderDate: (date: Temporal.PlainDate | Temporal.PlainMonthDay) => string;
