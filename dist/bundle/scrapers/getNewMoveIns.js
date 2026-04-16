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
    getNewMembers: () => getNewMembers,
    getNewMembersAfterPerson: () => getNewMembersAfterPerson,
    toCsv: () => toCsv,
    waitForNewMoveInsTable: () => waitForNewMoveInsTable
  });
  //! Go to https://lcr.churchofjesuschrist.org/mlt/report/members-moved-in?lang=eng
  async function waitForNewMoveInsTable() {
    return new Promise((resolve) => {
      const isReady = () => {
        const headerExists = !!document.querySelector("thead > tr > th");
        const rows = document.querySelectorAll("tbody:first-of-type > tr");
        const visibleRows = Array.from(rows).filter((r) => r.offsetParent !== null);
        return headerExists && visibleRows.length >= 2;
      };
      if (isReady()) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (isReady()) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
  function getNewMembersAfterPerson(allMembers, name, moveInDate) {
    const matches = allMembers.filter((m) => m.name === name && m.moveInDate === moveInDate);
    if (matches.length === 0) {
      throw new Error(`No member found with name "${name}" and move in date "${moveInDate}".`);
    }
    if (matches.length > 1) {
      throw new Error(`Multiple members found with name "${name}"and move in date "${moveInDate}".`);
    }
    const target = matches[0];
    if (!target?.moveInDate) {
      throw new Error(`Target member "${name}" has no move-in date.`);
    }
    const targetIndex = allMembers.findIndex((m) => m.name === name && m.moveInDate === moveInDate);
    return allMembers.slice(0, targetIndex);
  }
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
      const moveInDate = node.querySelector(`td:nth-child(${String(moveInDateIndex + 1)})`)?.innerText.trim();
      return { name, moveInDate };
    });
  }
  function toCsv(data) {
    return data.map((row) => [row.name, "", "", "", row.moveInDate].join("	")).join("\n");
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    const allMembers = getNewMembers();
    try {
      const targetName = prompt("Enter the name of the last new move-in you recorded:")?.trim();
      const targetDate = prompt("Enter the Move In Date of the last new move-in you recorded:")?.trim();
      if (!targetName || !targetDate) throw new Error("No name entered.");
      const filtered = getNewMembersAfterPerson(allMembers, targetName, targetDate);
      console.log(toCsv(filtered));
    } catch (err) {
      alert(String(err));
      console.error(err);
    }
  }
  return __toCommonJS(getNewMoveIns_exports);
})();
