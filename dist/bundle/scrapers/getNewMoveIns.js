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

  // src/scrapers/getNewMoveIns.ts
  var getNewMoveIns_exports = {};
  __export(getNewMoveIns_exports, {
    getNewMembers: () => getNewMembers
  });

  // src/utils.ts
  function consoleLogCsv(data) {
    console.log(data.map((row) => Object.values(row).join("	")).join("\n"));
  }

  // src/scrapers/getNewMoveIns.ts
  //! Go to https://lcr.churchofjesuschrist.org/mlt/report/members-moved-in?lang=eng
  function getNewMembers() {
    const headings = Array.from(document.querySelectorAll("thead > tr > th")).map(
      (th) => th.innerText.trim()
    );
    const findColumnIndex = (column) => headings.indexOf(column);
    const nameIndex = findColumnIndex("Name");
    const moveInDateIndex = findColumnIndex("Move In Date");
    const rows = Array.from(document.querySelectorAll("tbody > tr"));
    return rows.map((node) => {
      const name = node.querySelector(`td:nth-child(${String(nameIndex + 1)}) button`)?.innerText.trim();
      const moveInDte = node.querySelector(`td:nth-child(${String(moveInDateIndex + 1)})`)?.innerText.trim();
      return { name, moveInDte };
    });
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    const newMembers = getNewMembers();
    consoleLogCsv(newMembers);
  }
  return __toCommonJS(getNewMoveIns_exports);
})();
