import { parseDayMonthYear } from './date-utils'

export const hasCheckMark = (childNode: Element): boolean =>
  childNode.querySelector('path')?.getAttribute('d') ===
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.192-14.25a.997.997 0 00-.327.212l-7.452 7.196-2.187-2.701a1.007 1.007 0 00-1.412-.159l-.002.002a1.002 1.002 0 00-.141 1.415l2.82 3.481c.082.102.183.187.298.25a.997.997 0 001.25-.113L18.254 9.4l.002-.002a1.006 1.006 0 00.025-1.411l-.001-.001a.999.999 0 00-1.088-.237z'

/** Gets the date text where 0 is the first date text in the header */
export const getDateText = (number: number): string | undefined =>
  document.querySelectorAll<HTMLTableCellElement>('thead > tr > th')[number + 2]?.innerText

const monthSelector = document.querySelectorAll('select')[1]

export const changeMonthView = (dateText: string): void => {
  const yearMonthStr = Temporal.PlainYearMonth.from(parseDayMonthYear(dateText)).toString()

  if (!monthSelector) throw new Error('Missing month selector.')

  const option = Array.from(monthSelector.options).find(({ value }) => value === yearMonthStr)

  if (!option) throw new Error(`Month ${yearMonthStr} was not found in month selector dropdown.`)

  monthSelector.value = yearMonthStr
  monthSelector.dispatchEvent(new Event('change', { bubbles: true }))
}
