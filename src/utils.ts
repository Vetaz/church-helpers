export function consoleLogCsv(data: Record<string, string | undefined>[]) {
  console.log(data.map((row) => Object.values(row).join('\t')).join('\n'))
}

function parseParts(mdStr: string) {
  const [dayStr, monthStr, yearStr] = mdStr.trim().split(' ')

  const monthMap: Record<string, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  }

  const month = monthMap[monthStr]
  if (!month) throw new Error(`Invalid month: ${monthStr}`)

  return {
    day: Number(dayStr),
    month,
    year: yearStr !== undefined ? Number(yearStr) : undefined,
  }
}

export function parseMonthDay(mdStr: string): Temporal.PlainMonthDay {
  const { day, month } = parseParts(mdStr)
  return new Temporal.PlainMonthDay(month, day)
}

export function parseDate(mdStr: string): Temporal.PlainDate {
  const { day, month, year } = parseParts(mdStr)
  if (year === undefined) {
    throw new Error(`Expected a year in date string: ${mdStr}`)
  }
  return new Temporal.PlainDate(year, month, day)
}
