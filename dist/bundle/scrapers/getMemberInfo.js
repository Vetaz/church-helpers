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

  // src/scrapers/getMemberInfo.ts
  var getMemberInfo_exports = {};
  __export(getMemberInfo_exports, {
    getMemberInfo: () => getMemberInfo
  });

  // src/utils.ts
  function consoleLogCsv(data) {
    console.log(data.map((row) => Object.values(row).join("	")).join("\n"));
  }

  // src/scrapers/getMemberInfo.ts
  //! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/records/member-list?lang=eng
  //! Copy the result and paste into Google Sheets
  function showAddressInTable() {
    document.querySelector("form button")?.click();
    document.querySelectorAll("form button + ul li")[3]?.querySelector("input")?.click();
    document.querySelector("form button")?.click();
  }
  var waitTimeMs = 3e3;
  async function getMemberInfo() {
    showAddressInTable();
    window.scrollTo(0, document.body.scrollHeight);
    console.log(`Waiting ${waitTimeMs / 1e3} seconds for all data to load...`);
    await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
    const headings = Array.from(document.querySelectorAll("thead > tr > th")).map(
      (th) => th.innerText
    );
    const findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
    const nameIndex = findColumnIndex("Name");
    const genderIndex = findColumnIndex("Gender");
    const birthDateIndex = findColumnIndex("Birth Date");
    const addressIndex = findColumnIndex("Address");
    const data = [...document.querySelectorAll("tbody > tr")].map((node) => {
      const name = [...node.children[nameIndex].querySelectorAll("span")].at(-1)?.textContent?.trim();
      const profileLink = node.children[nameIndex].querySelector("a")?.href;
      const gender = node.children[genderIndex].textContent;
      const birthDate = node.children[birthDateIndex].textContent;
      const address = node.children[addressIndex].innerHTML.replaceAll("<br>", ", ");
      return { name, profileLink, gender, birthDate, address };
    });
    return data;
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    getMemberInfo().then(consoleLogCsv);
  }
  return __toCommonJS(getMemberInfo_exports);
})();
