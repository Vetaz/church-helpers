import { parseDate, parseMonthDay } from '../utils'

/**
 * Transpose a CSV string in the browser without external libraries.
 * Works for simple CSV (no quoted commas or multiline fields).
 */

function transposeCSV(csvText: string): string {
  // Split into rows
  const rows = csvText
    .trim()
    .split('\n')
    .map((row) => row.split('\t'))

  // Determine max columns (in case rows have different lengths)
  const maxCols = Math.max(...rows.map((r) => r.length))

  // Normalize rows to have equal length
  rows.forEach((r) => {
    while (r.length < maxCols) {
      r.push('') // Fill missing cells with empty string
    }
  })

  // Transpose: swap rows and columns
  const transposed: string[][] = []
  for (let col = 0; col < maxCols; col++) {
    const newRow: string[] = []
    for (let row = 0; row < rows.length; row++) {
      newRow.push(rows[row][col])
    }
    transposed.push(newRow)
  }

  // Convert back to CSV string
  return transposed.map((row) => row.join('\t')).join('\n')
}

/**
 * Parses a date string in "D MMM" format and returns the year based on current date.
 * - If the date (month/day) is on or before today's date in the current year, returns the current year.
 * - Otherwise, returns the previous year.
 * @param dateStr string - Date string like "1 Jan" or "23 Feb"
 * @returns number - The calculated year
 */
function getYearFromMonthDay(dateStr: string): number {
  const md = parseMonthDay(dateStr)
  const today = Temporal.Now.plainDateISO()

  const thisYearDate = md.toPlainDate({ year: today.year })

  return Temporal.PlainDate.compare(thisYearDate, today) <= 0 ? today.year : today.year - 1
}

const hasCheckMark = (childNode: Element) =>
  childNode.querySelector('path')?.getAttribute('d') ===
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.192-14.25a.997.997 0 00-.327.212l-7.452 7.196-2.187-2.701a1.007 1.007 0 00-1.412-.159l-.002.002a1.002 1.002 0 00-.141 1.415l2.82 3.481c.082.102.183.187.298.25a.997.997 0 001.25-.113L18.254 9.4l.002-.002a1.006 1.006 0 00.025-1.411l-.001-.001a.999.999 0 00-1.088-.237z'

/** Gets the date text where 1 is the first date text in the header. Website only shows 5 at a time */
const getDateText = (number: number) =>
  document.querySelectorAll<HTMLTableCellElement>('thead > tr > th')[number + 2]?.innerText

/** eg: 28 Sep 2025 */
type DateString = string
/** eg: Jordi Kloosterboer */
type NameString = string

const attendance: Record<DateString, NameString[]> = {}

/** Put attendance in attendance record from the current date set at https://lcr.churchofjesuschrist.org/report/class-and-quorum-attendance/overview */
function getAttendanceForCurrentDateSet() {
  document.querySelectorAll<HTMLTableRowElement>('tbody:first-of-type > tr')?.forEach((rowElement) => {
    const [name, gender, ...dates] = rowElement.querySelectorAll<HTMLTableCellElement>('td')
    const nameText = name.innerText?.trim()
    if (!nameText) return
    dates.forEach((date, index) => {
      const dateTextWithoutYear = getDateText(index)
      // Day can be 01, but we want to remove the leading zero for consistency with other date formats
      const day = String(Number(dateTextWithoutYear.split(' ')[0]))
      const month = dateTextWithoutYear.split(' ')[1]
      const dateText = `${day} ${month} ${getYearFromMonthDay(dateTextWithoutYear)}`.trim()
      if (hasCheckMark(date)) {
        if (!attendance[dateText]) attendance[dateText] = []
        attendance[dateText] = Array.from(new Set(attendance[dateText]).add(nameText))
      }
    })
  })

  console.log('Got attendance for current date set')
  console.log(
    `If you want to add attendance for other dates, rerun churchHelpers.getAttendanceForCurrentDateSet() after switching to the new date set.`,
  )
  console.log(
    'If you have all the attendance data you need, run churchHelpers.consoleLogAttendance() to log it to the console.',
  )
}

function getAttendanceCsv() {
  const csv = transposeCSV(
    Object.entries(attendance)
      .sort(([dateA], [dateB]) => Temporal.PlainDate.compare(parseDate(dateA), parseDate(dateB)))
      .map(([date, names]) => `${date}\t${names.join('\t')}`)
      .join('\n'),
  )
  return csv
}

function consoleLogAttendance() {
  const csv = getAttendanceCsv()
  if (csv) {
    console.log(csv)
  }
}

if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
  getAttendanceForCurrentDateSet()
}

export { getAttendanceForCurrentDateSet, getAttendanceCsv, consoleLogAttendance }
