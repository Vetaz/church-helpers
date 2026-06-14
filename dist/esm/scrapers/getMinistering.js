export function getMinistering() {
    const [district1, district2, district3, district4] = document.querySelectorAll('tbody');
    const isProposed = document.title.includes('Proposed');
    const ministeringAssignments = [];
    function convertDistrict(district, districtNumber) {
        district?.childNodes.forEach((node) => {
            const ministeringBrothersNode = node.childNodes[1];
            const assignedHouseholdsNode = node.childNodes[isProposed ? 2 : 6];
            const ministeringBrothers = ministeringBrothersNode?.childNodes
                ? Array.from(ministeringBrothersNode.childNodes)
                    .map((node) => {
                    const text = node.textContent;
                    return typeof text === 'string' ? text.trim() : '';
                })
                    .filter((t) => t !== '')
                    .join('; ')
                : '';
            const assignedHouseholds = assignedHouseholdsNode?.childNodes
                ? Array.from(assignedHouseholdsNode.childNodes)
                    .map((node) => {
                    const text = node.textContent;
                    return typeof text === 'string' ? text.trim() : '';
                })
                    .filter((t) => t !== '')
                    .join('; ')
                : '';
            ministeringAssignments.push([districtNumber, ministeringBrothers, assignedHouseholds]);
        });
    }
    convertDistrict(district1, 1);
    convertDistrict(district2, 2);
    convertDistrict(district3, 3);
    convertDistrict(district4, 4);
    return ministeringAssignments;
}
if (typeof window !== 'undefined' && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    // For direct use
    console.log(`District Number\tMinistering Brothers\tAssigned Households\n${getMinistering()
        .map(([dn, mb, ah]) => `${String(dn)}\t${mb}\t${ah}`)
        .join('\n')}`);
}
