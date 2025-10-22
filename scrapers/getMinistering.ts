const [district1, district2, district3] = document.querySelectorAll('tbody')

const isProposed = document.title.includes('Proposed')

type MinisteringBrothers = string
type AssignedHouseholds = string
type DistrictNumber = number

const ministeringAssignments: [DistrictNumber, MinisteringBrothers, AssignedHouseholds][] = []

function convertDistrict(district: HTMLTableSectionElement, districtNumber: number) {
  district.childNodes.forEach((node) => {
    const ministeringBrothersNode = node.childNodes[1]
    const assignedHouseholdsNode = node.childNodes[isProposed ? 2 : 6]

    const ministeringBrothers = ministeringBrothersNode?.textContent?.split('  ').join('; ') ?? ''
    const assignedHouseholds = assignedHouseholdsNode?.textContent?.split('  ').join('; ') ?? ''
    ministeringAssignments.push([districtNumber, ministeringBrothers, assignedHouseholds])
  })
}

convertDistrict(district1, 1)
convertDistrict(district2, 2)
convertDistrict(district3, 2)

console.log(
  `District Number\tMinistering Brothers\tAssigned Households\n${ministeringAssignments
    .map(([dn, mb, ah]) => `${dn}\t${mb}\t${ah}`)
    .join('\n')}`
)
