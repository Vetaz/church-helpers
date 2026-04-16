import { getDateText, hasCheckMark } from '../attendance-utils'
import { getYearFromMonthDay, parseDayMonthYear } from '../date-utils'

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
    for (const row of rows) {
      const cell = row[col]
      if (cell !== undefined) {
        newRow.push(cell)
      }
    }

    transposed.push(newRow)
  }

  // Convert back to CSV string
  return transposed.map((row) => row.join('\t')).join('\n')
}

/** eg: 28 Sep 2025 */
type DateString = string
/** eg: Jordi Kloosterboer */
type NameString = string

const attendance: Record<DateString, NameString[]> = {}

/** Put attendance in attendance record from the current date set at https://lcr.churchofjesuschrist.org/report/class-and-quorum-attendance/overview */
function getAttendanceForCurrentDateSet(): void {
  document.querySelectorAll<HTMLTableRowElement>('tbody:first-of-type > tr').forEach((rowElement) => {
    const [name, _gender, ...dates] = rowElement.querySelectorAll<HTMLTableCellElement>('td')
    const nameText = name?.innerText.trim()
    if (!nameText) return
    dates.forEach((date, index) => {
      const dateTextWithoutYear = getDateText(index)
      // Day can be 01, but we want to remove the leading zero for consistency with other date formats
      const day = String(Number(dateTextWithoutYear?.split(' ')[0]))
      const month = dateTextWithoutYear?.split(' ')[1]
      if (!month || !dateTextWithoutYear)
        throw new Error(
          `Could not get month or date text for index ${String(index)}. dateTextWithoutYear: ${dateTextWithoutYear ?? ''}`,
        )
      const dateText = `${day} ${month} ${String(getYearFromMonthDay(dateTextWithoutYear))}`.trim()
      if (hasCheckMark(date)) {
        attendance[dateText] ??= []
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

function getAttendanceCsv(): string {
  const csv = transposeCSV(
    Object.entries(attendance)
      .sort(([dateA], [dateB]) => Temporal.PlainDate.compare(parseDayMonthYear(dateA), parseDayMonthYear(dateB)))
      .map(([date, names]) => `${date}\t${names.join('\t')}`)
      .join('\n'),
  )
  return csv
}

function consoleLogAttendance(): void {
  const csv = getAttendanceCsv()
  if (csv) {
    console.log(csv)
  }
}

if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
  getAttendanceForCurrentDateSet()
}

export { getAttendanceForCurrentDateSet, getAttendanceCsv, consoleLogAttendance }
