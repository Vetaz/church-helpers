import { consoleLogCsv } from '../utils'

//! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng
//! Copy the result and paste into Google Sheets

async function waitForTable(): Promise<void> {
  return new Promise<void>((resolve) => {
    // If table already exists, resolve immediately
    if (document.querySelector('thead > tr > th')) {
      resolve()
      return
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector('thead > tr > th')) {
        observer.disconnect()
        resolve()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

function showAddressInTable(): void {
  const button = document.querySelector<HTMLButtonElement>('form button')
  if (!button) return

  button.click()
  const items = document.querySelectorAll<HTMLLIElement>('form button + ul li')
  const addressItem = items[3]
  addressItem?.querySelector<HTMLInputElement>('input')?.click()
  button.click()
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loadAllRows(): Promise<void> {
  let lastHeight = 0

  while (true) {
    window.scrollTo(0, document.body.scrollHeight)
    await wait(500)

    const newHeight = document.body.scrollHeight
    if (newHeight === lastHeight) break
    lastHeight = newHeight
  }
}

type MemberInfo = {
  name?: string
  profileLink?: string
  gender?: string
  birthDate?: string
  address?: string
}

export async function getMemberInfo(): Promise<MemberInfo[]> {
  showAddressInTable()
  // Wait for table to exist
  await waitForTable()
  // Load all rows
  await loadAllRows()
  const headings = Array.from(document.querySelectorAll<HTMLTableCellElement>('thead > tr > th')).map((th) =>
    th.innerText.trim(),
  )

  const findColumnIndex = (column: string): number => headings.indexOf(column)

  const nameIndex = findColumnIndex('Name')
  const genderIndex = findColumnIndex('Gender')
  const birthDateIndex = findColumnIndex('Birth Date')
  const addressIndex = findColumnIndex('Address')

  const rows = Array.from(document.querySelectorAll('tbody > tr'))

  return rows.map((node) => {
    const name = node.children[nameIndex]?.querySelector('span:last-child')?.textContent.trim()

    const profileLink = node.children[nameIndex]?.querySelector('a')?.href
    const gender = node.children[genderIndex]?.textContent.trim()
    const birthDate = node.children[birthDateIndex]?.textContent.trim()
    const address = node.children[addressIndex]?.innerHTML.replaceAll('<br>', ', ').trim()

    return { name, profileLink, gender, birthDate, address } satisfies MemberInfo
  })
}

if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
  getMemberInfo().then(consoleLogCsv).catch(console.log)
}

