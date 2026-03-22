"use strict";
var churchHelpers = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/scrapers/getMinistering.ts
  var getMinistering_exports = {};
  __export(getMinistering_exports, {
    getMinistering: () => getMinistering
  });
  function getMinistering() {
    const [district1, district2, district3] = document.querySelectorAll("tbody");
    const isProposed = document.title.includes("Proposed");
    const ministeringAssignments = [];
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
    return ministeringAssignments;
  }
  console.log(
    `District Number	Ministering Brothers	Assigned Households
${getMinistering().map(([dn, mb, ah]) => `${dn}	${mb}	${ah}`).join("\n")}`
  );
  return __toCommonJS(getMinistering_exports);
})();
