type PriesthoodInfo = { name: string; priesthood: string }

//! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/mlt/orgs?unitOrgTypeId=70&lang=eng specifically on the Members tab
//! Copy the result and paste into Google Sheets

export function getPriesthood(): PriesthoodInfo[] {
  const headings = Array.from(document.querySelectorAll<HTMLTableCellElement>('thead > tr > th')).map(
    (th) => th.innerText,
  )

  const findColumnIndex = (column: string): number => headings.findIndex((heading) => heading === column)
  const nameIndex = findColumnIndex('Name')
  const priesthoodIndex = findColumnIndex('Priesthood')

  const data = [...document.querySelectorAll<HTMLTableRowElement>('tbody > tr')].map((node) => {
    const name = (node.children[nameIndex] as HTMLTableCellElement).innerText
    const priesthood = (node.children[priesthoodIndex] as HTMLTableCellElement).innerText

    return { name, priesthood }
  })

  return data
}

export function toCsv(data: PriesthoodInfo[]): string {
  return data.map((row) => [row.name, row.priesthood].join('\t')).join('\n')
}

if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
  console.log(toCsv(getPriesthood()))
}
