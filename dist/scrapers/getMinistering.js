// src/scrapers/getMinistering.ts
var [district1, district2, district3] = document.querySelectorAll("tbody");
var isProposed = document.title.includes("Proposed");
var ministeringAssignments = [];
function convertDistrict(district, districtNumber) {
  district.childNodes.forEach((node) => {
    const ministeringBrothersNode = node.childNodes[1];
    const assignedHouseholdsNode = node.childNodes[isProposed ? 2 : 6];
    const ministeringBrothers = ministeringBrothersNode?.textContent?.split("  ").join("; ") ?? "";
    const assignedHouseholds = assignedHouseholdsNode?.textContent?.split("  ").join("; ") ?? "";
    ministeringAssignments.push([districtNumber, ministeringBrothers, assignedHouseholds]);
  });
}
convertDistrict(district1, 1);
convertDistrict(district2, 2);
convertDistrict(district3, 3);
console.log(
  `District Number	Ministering Brothers	Assigned Households
${ministeringAssignments.map(([dn, mb, ah]) => `${dn}	${mb}	${ah}`).join("\n")}`
);
