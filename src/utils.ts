export function consoleLogCsv(data: Record<string, string | undefined>[]) {
  console.log(data.map((row) => Object.values(row).join('\t')).join('\n'))
}
