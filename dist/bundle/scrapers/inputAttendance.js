"use strict";
var churchHelpers = (() => {
  // src/date-utils.ts
  function parseParts(mdStr) {
    const [dayStr, monthStr, yearStr] = mdStr.trim().split(" ");
    if (dayStr === void 0 || monthStr === void 0) {
      throw new Error(`Invalid date string: ${mdStr}`);
    }
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
    function isTrueMonth(monthStr2) {
      return monthStr2 in monthMap;
    }
    if (!isTrueMonth(monthStr)) {
      throw new Error(`Invalid month: ${monthStr}`);
    }
    const month = monthMap[monthStr];
    return { day: Number(dayStr), month, year: yearStr !== void 0 ? Number(yearStr) : void 0 };
  }
  function parseDayMonthYear(mdStr) {
    const { day, month, year } = parseParts(mdStr);
    if (year === void 0) {
      throw new Error(`Expected a year in date string: ${mdStr}`);
    }
    return new Temporal.PlainDate(year, month, day);
  }
  var convertPlainDateToHeaderDate = (date) => {
    return date.toLocaleString("en-GB", { day: "2-digit", month: "short" });
  };

  // src/attendance-utils.ts
  var hasCheckMark = (childNode) => childNode.querySelector("path")?.getAttribute("d") === "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.192-14.25a.997.997 0 00-.327.212l-7.452 7.196-2.187-2.701a1.007 1.007 0 00-1.412-.159l-.002.002a1.002 1.002 0 00-.141 1.415l2.82 3.481c.082.102.183.187.298.25a.997.997 0 001.25-.113L18.254 9.4l.002-.002a1.006 1.006 0 00.025-1.411l-.001-.001a.999.999 0 00-1.088-.237z";
  var getDateText = (number) => document.querySelectorAll("thead > tr > th")[number + 2]?.innerText;
  var monthSelector = document.querySelectorAll("select")[1];
  var changeMonthView = (dateText) => {
    const yearMonthStr = Temporal.PlainYearMonth.from(parseDayMonthYear(dateText)).toString();
    if (!monthSelector) throw new Error("Missing month selector.");
    const option = Array.from(monthSelector.options).find(({ value }) => value === yearMonthStr);
    if (!option) throw new Error(`Month ${yearMonthStr} was not found in month selector dropdown.`);
    monthSelector.value = yearMonthStr;
    monthSelector.dispatchEvent(new Event("change", { bubbles: true }));
  };

  // src/scrapers/inputAttendance.ts
  function addManualAttendance(dateText, rawNames) {
    if (!dateText) throw new Error("dateText is required");
    if (!rawNames.trim()) return;
    changeMonthView(dateText);
    const dateIndex = Array.from({ length: 5 }).findIndex(
      (_, index) => getDateText(index) === convertPlainDateToHeaderDate(parseDayMonthYear(dateText))
    );
    if (dateIndex === -1) throw new Error("Could not find specified date");
    const namesToRecord = new Set(
      rawNames.split("\n").map((n) => n.trim()).filter(Boolean)
    );
    if (namesToRecord.size === 0) return;
    const badNames = /* @__PURE__ */ new Set();
    let previousName = null;
    document.querySelectorAll("tbody:first-of-type > tr").forEach((rowElement) => {
      const name = rowElement.querySelector("td")?.innerText.trim();
      if (!name) return;
      if (name === previousName) {
        badNames.add(name);
      }
      previousName = name;
    });
    document.querySelectorAll("tbody:first-of-type > tr").forEach((rowElement) => {
      const [nameCell, _gender, ...dateCells] = rowElement.querySelectorAll("td");
      const name = nameCell?.innerText.trim();
      if (!name) return;
      if (badNames.has(name)) return;
      const dateCell = dateCells[dateIndex];
      if (namesToRecord.has(name)) {
        if (dateCell && !hasCheckMark(dateCell) && namesToRecord.has(name)) {
          dateCell.querySelector("button")?.click();
        }
      }
    });
    const badNamesToRecord = badNames.intersection(namesToRecord);
    if (badNamesToRecord.size > 0)
      throw new Error(
        `The following names were not recorded because there are multiple people with these names! ${Array.from(badNamesToRecord).join("; ")}`
      );
  }
  function getMostRecentSunday() {
    const today = Temporal.Now.plainDateISO();
    const dayOfWeek = today.dayOfWeek;
    if (dayOfWeek === 7) return today;
    return today.subtract({ days: dayOfWeek });
  }
  if (typeof window !== "undefined" && !window.DO_NOT_AUTO_RUN_SCRAPERS) {
    const todayOrRecentSunday = getMostRecentSunday().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    try {
      const rawNames = prompt("Enter list of names")?.trim();
      const dateText = prompt(`Enter the date`, todayOrRecentSunday)?.trim() || todayOrRecentSunday;
      if (!rawNames) throw new Error("No names entered.");
      addManualAttendance(dateText, rawNames);
      alert("All names have been recorded. Please wait for the checkboxes to settle.");
    } catch (err) {
      alert(String(err));
      console.error(err);
    }
  }
})();
