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

  // src/scrapers/getAttendance.ts
  var getAttendance_exports = {};
  __export(getAttendance_exports, {
    consoleLogAttendance: () => consoleLogAttendance,
    getAttendanceCsv: () => getAttendanceCsv,
    getAttendanceForCurrentDateSet: () => getAttendanceForCurrentDateSet
  });

  // src/utils.ts
  function parseParts(mdStr) {
    const [dayStr, monthStr, yearStr] = mdStr.trim().split(" ");
    const monthMap = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12
    };
    const month = monthMap[monthStr];
    if (!month) throw new Error(`Invalid month: ${monthStr}`);
    return {
      day: Number(dayStr),
      month,
      year: yearStr !== void 0 ? Number(yearStr) : void 0
    };
  }
  function parseMonthDay(mdStr) {
    const { day, month } = parseParts(mdStr);
    return new Temporal.PlainMonthDay(month, day);
  }
  function parseDate(mdStr) {
    const { day, month, year } = parseParts(mdStr);
    if (year === void 0) {
      throw new Error(`Expected a year in date string: ${mdStr}`);
    }
    return new Temporal.PlainDate(year, month, day);
  }

  // src/scrapers/getAttendance.ts
  function transposeCSV(csvText) {
    const rows = csvText.trim().split("\n").map((row) => row.split("	"));
    const maxCols = Math.max(...rows.map((r) => r.length));
    rows.forEach((r) => {
      while (r.length < maxCols) {
        r.push("");
      }
    });
    const transposed = [];
    for (let col = 0; col < maxCols; col++) {
      const newRow = [];
      for (let row = 0; row < rows.length; row++) {
        newRow.push(rows[row][col]);
      }
      transposed.push(newRow);
    }
    return transposed.map((row) => row.join("	")).join("\n");
  }
  function getYearFromMonthDay(dateStr) {
    const md = parseMonthDay(dateStr);
    const today = Temporal.Now.plainDateISO();
    const thisYearDate = md.toPlainDate({ year: today.year });
    return Temporal.PlainDate.compare(thisYearDate, today) <= 0 ? today.year : today.year - 1;
  }
  var hasCheckMark = (childNode) => childNode.querySelector("path")?.getAttribute("d") === "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.192-14.25a.997.997 0 00-.327.212l-7.452 7.196-2.187-2.701a1.007 1.007 0 00-1.412-.159l-.002.002a1.002 1.002 0 00-.141 1.415l2.82 3.481c.082.102.183.187.298.25a.997.997 0 001.25-.113L18.254 9.4l.002-.002a1.006 1.006 0 00.025-1.411l-.001-.001a.999.999 0 00-1.088-.237z";
  var getDateText = (number) => document.querySelectorAll("thead > tr > th")[number + 2]?.innerText;
  var attendance = {};
  function getAttendanceForCurrentDateSet() {
    document.querySelectorAll("tbody:first-of-type > tr")?.forEach((rowElement) => {
      const [name, gender, ...dates] = rowElement.querySelectorAll("td");
      const nameText = name.innerText?.trim();
      if (!nameText) return;
      dates.forEach((date, index) => {
        const dateTextWithoutYear = getDateText(index);
        const day = String(Number(dateTextWithoutYear.split(" ")[0]));
        const month = dateTextWithoutYear.split(" ")[1];
        const dateText = `${day} ${month} ${getYearFromMonthDay(dateTextWithoutYear)}`.trim();
        if (hasCheckMark(date)) {
          if (!attendance[dateText]) attendance[dateText] = [];
          attendance[dateText] = Array.from(new Set(attendance[dateText]).add(nameText));
        }
      });
    });
    console.log("Got attendance for current date set");
    console.log(
      `If you want to add attendance for other dates, rerun churchHelpers.getAttendanceForCurrentDateSet() after switching to the new date set.`
    );
    console.log(
      "If you have all the attendance data you need, run churchHelpers.consoleLogAttendance() to log it to the console."
    );
  }
  function getAttendanceCsv() {
    const csv = transposeCSV(
      Object.entries(attendance).sort(([dateA], [dateB]) => Temporal.PlainDate.compare(parseDate(dateA), parseDate(dateB))).map(([date, names]) => `${date}	${names.join("	")}`).join("\n")
    );
    return csv;
  }
  function consoleLogAttendance() {
    const csv = getAttendanceCsv();
    if (csv) {
      console.log(csv);
    }
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    getAttendanceForCurrentDateSet();
  }
  return __toCommonJS(getAttendance_exports);
})();
