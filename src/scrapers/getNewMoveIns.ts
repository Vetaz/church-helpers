//! Go to https://lcr.churchofjesuschrist.org/mlt/report/members-moved-in?lang=eng

import { consoleLogCsv } from '../utils'

type MemberInfo = { name?: string; moveInDte?: string }

export function getNewMembers(): MemberInfo[] {
  const headings = Array.from(document.querySelectorAll<HTMLTableCellElement>('thead > tr > th')).map((th) =>
    th.innerText.trim(),
  )

  const findColumnIndex = (column: string): number => headings.indexOf(column)

  const nameIndex = findColumnIndex('Name')
  const moveInDateIndex = findColumnIndex('Move In Date')

  const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>('tbody > tr'))

  return rows.map((node) => {
    const name = node
      .querySelector<HTMLButtonElement>(`td:nth-child(${String(nameIndex + 1)}) button`)
      ?.innerText.trim()
    const moveInDte = node
      .querySelector<HTMLTableCellElement>(`td:nth-child(${String(moveInDateIndex + 1)})`)
      ?.innerText.trim()

    return { name, moveInDte } satisfies MemberInfo
  })
}

if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
  const newMembers = getNewMembers()
  consoleLogCsv(newMembers)
}
