export {}
// This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng
// Copy the result and paste into Google Sheets

const headings = Array.from(document.querySelectorAll<HTMLTableCellElement>('thead > tr > th')).map(
  (th) => th.innerText,
)

const findColumnIndex = (column: string) => headings.findIndex((heading) => heading === column)
const nameIndex = findColumnIndex('Name')
const genderIndex = findColumnIndex('Gender')
const birthDateIndex = findColumnIndex('Birth Date')
const addressIndex = findColumnIndex('Address')

const data = [...document.querySelectorAll('tbody > tr')].map((node) => {
  const name = [...node.children[nameIndex].querySelectorAll('span')].at(-1)?.textContent?.trim()
  const profileLink = node.children[nameIndex].querySelector('a')?.href
  const gender = node.children[genderIndex].textContent
  const birthDate = node.children[birthDateIndex].textContent
  const address = node.children[addressIndex].innerHTML.replaceAll('<br>', ', ')

  return { name, profileLink, gender, birthDate, address }
})

console.log(data.map((row) => Object.values(row).join('\t')).join('\n'))
