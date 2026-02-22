export { }

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
  // Map of month abbreviations to month numbers (0 = January)
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }

  // Split the input into day and month
  const [dayPart, monthPart] = dateStr.trim().split(' ')
  if (!dayPart || !monthPart || !(monthPart in monthMap)) {
    throw new Error(`Invalid date string: ${dateStr}`)
  }

  const day = parseInt(dayPart, 10)
  const month = monthMap[monthPart]

  // Get today’s date
  const today = new Date()
  const thisYear = today.getFullYear()

  // Create a Date object using current year for comparison
  const inputDate = new Date(thisYear, month, day)

  // If the date has passed or is today, use current year, else previous year
  if (inputDate <= today) {
    return thisYear
  } else {
    return thisYear - 1
  }
}

const hasCheckMark = (childNode: Element) =>
  childNode.querySelector('path')?.getAttribute('d') ===
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.192-14.25a.997.997 0 00-.327.212l-7.452 7.196-2.187-2.701a1.007 1.007 0 00-1.412-.159l-.002.002a1.002 1.002 0 00-.141 1.415l2.82 3.481c.082.102.183.187.298.25a.997.997 0 001.25-.113L18.254 9.4l.002-.002a1.006 1.006 0 00.025-1.411l-.001-.001a.999.999 0 00-1.088-.237z'

/** Gets the date text where 1 is the first date text in the header. Website only shows 5 at a time */
const getDateText = (number: number) =>
  document.querySelector('thead')?.childNodes[0].childNodes[number + 2].textContent

const getMembersOfTotalText = () =>
  document.querySelector(
    '#__next > div > div.sc-3wjzbl-0.jEyqMD > div:nth-child(1) > div > div.sc-1bd9vcz-5.GcsXn > div.sc-lf3bj0-0.biBXLT > div:nth-child(7)',
  )?.textContent

const isLastPage = () => {
  const total = getMembersOfTotalText()?.split('/')[1]
  return new RegExp(`-${total}/${total}`).test(getMembersOfTotalText() ?? '')
}

const goToNextPage = () =>
  (
    document.querySelector(
      '#__next > div > div.sc-3wjzbl-0.jEyqMD > div:nth-child(1) > div > div.sc-1bd9vcz-5.GcsXn > div.sc-lf3bj0-0.biBXLT > div.sc-b87b8e2-0.cLfglj',
    ) as HTMLElement | undefined
  )?.click()

const goToFirstPage = () =>
  (
    document.querySelector(
      '#__next > div > div.sc-3wjzbl-0.jEyqMD > div:nth-child(1) > div > div.sc-1bd9vcz-5.GcsXn > div.sc-lf3bj0-0.biBXLT > div.sc-f155593d-0.jVFBIX',
    ) as HTMLElement | undefined
  )?.click()

/** eg: 28 Sep 2025 */
type DateString = string
/** eg: Jordi Kloosterboer */
type NameString = string

const attendance: Record<DateString, NameString[]> = {}

/** Put attendance in attendance record from the current date set at https://lcr.churchofjesuschrist.org/report/class-and-quorum-attendance/overview */
function getAttendanceForCurrentDateSet() {
  function getAttendance() {
    document.querySelector('tbody')?.childNodes.forEach((node) => {
      const [name, gender, , date1, date2, date3, date4, date5] = node.childNodes
      const nameText = name.textContent?.trim()
      if (!nameText) return
      ;[date1, date2, date3, date4, date5].forEach((date, index) => {
        const dateTextWithoutYear = getDateText(index + 1)
        const dateText = `${getDateText(index + 1)} ${dateTextWithoutYear ? getYearFromMonthDay(dateTextWithoutYear) : ''}`
        if (hasCheckMark(date as Element)) {
          if (!attendance[dateText]) attendance[dateText] = []
          attendance[dateText] = Array.from(new Set(attendance[dateText]).add(nameText))
        }
      })
    })
  }

  goToFirstPage()
  getAttendance()

  while (!isLastPage()) {
    goToNextPage()
    getAttendance()
  }
  console.log('Got attendance for current date set')
  console.log(
    `If you want to add attendance for other dates, rerun getAttendanceForCurrentDateSet() after switching to the new date set.`,
  )
  console.log('If you have all the attendance data you need, run consoleLogAttendance() to log it to the console.')
}

function consoleLogAttendance() {
  console.log(
    transposeCSV(
      Object.entries(attendance)
        .sort(([dateA], [dateB]) => Number(new Date(dateA)) - Number(new Date(dateB)))
        .map(([date, names]) => `${date}\t${names.join('\t')}`)
        .join('\n'),
    ),
  )
}

getAttendanceForCurrentDateSet()
