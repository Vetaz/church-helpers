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

  // src/scrapers/getPriesthood.ts
  var getPriesthood_exports = {};
  __export(getPriesthood_exports, {
    getPriesthood: () => getPriesthood
  });

  // src/utils.ts
  function consoleLogCsv(data) {
    console.log(data.map((row) => Object.values(row).join("	")).join("\n"));
  }

  // src/scrapers/getPriesthood.ts
  //! This script is meant to be run in the browser console for https://lcr.churchofjesuschrist.org/mlt/orgs?unitOrgTypeId=70&lang=eng specifically on the Members tab
  //! Copy the result and paste into Google Sheets
  function getPriesthood() {
    const headings = Array.from(document.querySelectorAll("thead > tr > th")).map(
      (th) => th.innerText
    );
    const findColumnIndex = (column) => headings.findIndex((heading) => heading === column);
    const nameIndex = findColumnIndex("Name");
    const priesthoodIndex = findColumnIndex("Priesthood");
    const data = [...document.querySelectorAll("tbody > tr")].map((node) => {
      const name = node.children[nameIndex].innerText;
      const priesthood = node.children[priesthoodIndex].innerText;
      return { name, priesthood };
    });
    return data;
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    consoleLogCsv(getPriesthood());
  }
  return __toCommonJS(getPriesthood_exports);
})();
