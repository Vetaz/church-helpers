//! Go to https://lcr.churchofjesuschrist.org/mlt/report/members-moved-in?lang=eng
export async function waitForNewMoveInsTable(): Promise<void> {
  return new Promise<void>((resolve) => {
    const isReady = (): boolean => {
      const headerExists = !!document.querySelector('thead > tr > th')
      const rows = document.querySelectorAll<HTMLTableRowElement>('tbody:first-of-type > tr')
      const visibleRows = Array.from(rows).filter((r) => r.offsetParent !== null)
      return headerExists && visibleRows.length >= 2
    }

    // If already ready, resolve immediately
    if (isReady()) {
      resolve()
      return
    }

    const observer = new MutationObserver(() => {
      if (isReady()) {
        observer.disconnect()
        resolve()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  })
}

export function getNewMembersAfterPerson(allMembers: MemberInfo[], name: string, moveInDate: string): MemberInfo[] {
  // Find all matches
  const matches = allMembers.filter((m) => m.name === name && m.moveInDate === moveInDate)

  if (matches.length === 0) {
    throw new Error(`No member found with name "${name}" and move in date "${moveInDate}".`)
  }
  if (matches.length > 1) {
    throw new Error(`Multiple members found with name "${name}"and move in date "${moveInDate}".`)
  }

  const target = matches[0]
  if (!target?.moveInDate) {
    throw new Error(`Target member "${name}" has no move-in date.`)
  }

  // Find the exact index of the target in the original list
  const targetIndex = allMembers.findIndex((m) => m.name === name && m.moveInDate === moveInDate)

  // Return all members before the target in the array (moved in after target)
  return allMembers.slice(0, targetIndex)
}

export type MemberInfo = { name?: string; moveInDate?: string }

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
    const moveInDate = node
      .querySelector<HTMLTableCellElement>(`td:nth-child(${String(moveInDateIndex + 1)})`)
      ?.innerText.trim()

    return { name, moveInDate } satisfies MemberInfo
  })
}

export function toCsv(data: MemberInfo[]): string {
  return data.map((row) => [row.name, '', '', '', row.moveInDate].join('\t')).join('\n')
}

if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
  const allMembers = getNewMembers()

  try {
    const targetName = prompt('Enter the name of the last new move-in you recorded:')?.trim()
    const targetDate = prompt('Enter the Move In Date of the last new move-in you recorded:')?.trim()
    if (!targetName || !targetDate) throw new Error('No name entered.')

    const filtered = getNewMembersAfterPerson(allMembers, targetName, targetDate)

    console.log(toCsv(filtered))
  } catch (err) {
    alert(String(err))
    console.error(err)
  }
}
