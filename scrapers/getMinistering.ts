const [district1, district2] = document.querySelectorAll('tbody')

const isProposed = document.title.includes('Proposed')

type MinisteringBrothers = string
type AssignedHouseholds = string

const ministeringAssignments: [MinisteringBrothers, AssignedHouseholds][] = []

function convertDistrict(district: HTMLTableSectionElement) {
  district.childNodes.forEach((node) => {
    const ministeringBrothersNode = node.childNodes[1]
    const assignedHouseholdsNode = node.childNodes[isProposed ? 2 : 6]

    const ministeringBrothers = ministeringBrothersNode?.textContent?.split('  ').join('; ') ?? ''
    const assignedHouseholds = assignedHouseholdsNode?.textContent?.split('  ').join('; ') ?? ''
    ministeringAssignments.push([ministeringBrothers, assignedHouseholds])
  })
}

convertDistrict(district1)
convertDistrict(district2)

console.log(
  `Ministering Brothers\tAssigned Households\n${ministeringAssignments.map(([mb, ah]) => `${mb}\t${ah}`).join('\n')}`
)
