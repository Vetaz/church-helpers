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
  async function waitForTable() {
    return new Promise((resolve) => {
      if (document.querySelector("thead > tr > th")) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector("thead > tr > th")) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function showAddressInTable() {
    const button = document.querySelector("form button");
    if (!button) return;
    button.click();
    const items = document.querySelectorAll("form button + ul li");
    const addressItem = items[3];
    addressItem?.querySelector("input")?.click();
    button.click();
  }
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function loadAllRows() {
    let lastHeight = 0;
    while (true) {
      window.scrollTo(0, document.body.scrollHeight);
      await wait(500);
      const newHeight = document.body.scrollHeight;
      if (newHeight === lastHeight) break;
      lastHeight = newHeight;
    }
  }
  async function getMemberInfo() {
    showAddressInTable();
    await waitForTable();
    await loadAllRows();
    const headings = Array.from(document.querySelectorAll("thead > tr > th")).map(
      (th) => th.innerText.trim()
    );
    console.log({ headings });
    const findColumnIndex = (column) => headings.indexOf(column);
    const nameIndex = findColumnIndex("Name");
    const genderIndex = findColumnIndex("Gender");
    const birthDateIndex = findColumnIndex("Birth Date");
    const addressIndex = findColumnIndex("Address");
    const rows = Array.from(document.querySelectorAll("tbody > tr"));
    return rows.map((node) => {
      const name = node.children[nameIndex]?.querySelector("span:last-child")?.textContent?.trim();
      const profileLink = node.children[nameIndex].querySelector("a")?.href;
      const gender = node.children[genderIndex]?.textContent?.trim();
      const birthDate = node.children[birthDateIndex]?.textContent?.trim();
      const address = node.children[addressIndex]?.innerHTML.replaceAll("<br>", ", ").trim();
      return { name, profileLink, gender, birthDate, address };
    });
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    getMemberInfo().then(consoleLogCsv);
  }
  return __toCommonJS(getMemberInfo_exports);
})();
