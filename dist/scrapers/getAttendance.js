"use strict";
const hasCheckMark = (childNode) => childNode.querySelector('path')?.getAttribute('d') ===
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.192-14.25a.997.997 0 00-.327.212l-7.452 7.196-2.187-2.701a1.007 1.007 0 00-1.412-.159l-.002.002a1.002 1.002 0 00-.141 1.415l2.82 3.481c.082.102.183.187.298.25a.997.997 0 001.25-.113L18.254 9.4l.002-.002a1.006 1.006 0 00.025-1.411l-.001-.001a.999.999 0 00-1.088-.237z';
/** Gets the date text where 1 is the first date text in the header. Website only shows 5 at a time */
const getDateText = (number) => document.querySelector('thead')?.childNodes[0].childNodes[number + 2].textContent;
const getMembersOfTotalText = () => document.querySelector('#__next > div > div.sc-3wjzbl-0.jEyqMD > div:nth-child(1) > div > div.sc-1bd9vcz-5.GcsXn > div.sc-lf3bj0-0.biBXLT > div:nth-child(7)')?.textContent;
const isLastPage = () => {
    const total = getMembersOfTotalText()?.split('/')[1];
    return new RegExp(`-${total}/${total}`).test(getMembersOfTotalText() ?? '');
};
const goToNextPage = () => document.querySelector('#__next > div > div.sc-3wjzbl-0.jEyqMD > div:nth-child(1) > div > div.sc-1bd9vcz-5.GcsXn > div.sc-lf3bj0-0.biBXLT > div.sc-b87b8e2-0.cLfglj')?.click();
const goToFirstPage = () => document.querySelector('#__next > div > div.sc-3wjzbl-0.jEyqMD > div:nth-child(1) > div > div.sc-1bd9vcz-5.GcsXn > div.sc-lf3bj0-0.biBXLT > div.sc-f155593d-0.jVFBIX')?.click();
const attendance = {};
/** Put attendance in attendance record from the current date set at https://lcr.churchofjesuschrist.org/report/class-and-quorum-attendance */
function getAttendanceForCurrentDateSet() {
    function getAttendance() {
        document.querySelector('tbody')?.childNodes.forEach((node) => {
            const [name, gender, , date1, date2, date3, date4, date5] = node.childNodes;
            const nameText = name.textContent?.trim();
            if (!nameText)
                return;
            [date1, date2, date3, date4, date5].forEach((date, index) => {
                const dateText = `${getDateText(index + 1)} 2025`;
                if (hasCheckMark(date)) {
                    if (!attendance[dateText])
                        attendance[dateText] = [];
                    attendance[dateText] = Array.from(new Set(attendance[dateText]).add(nameText));
                }
            });
        });
    }
    goToFirstPage();
    getAttendance();
    while (!isLastPage()) {
        goToNextPage();
        getAttendance();
    }
    console.log('Got attendance for current date set');
    console.log(`If you want to add attendance for other dates, rerun getAttendanceForCurrentDateSet() after switching to the new date set.`);
    console.log('If you have all the attendance data you need, run consoleLogAttendance() to log it to the console.');
}
function consoleLogAttendance() {
    console.log(Object.entries(attendance)
        .map(([name, dates]) => `${name}\n${dates.join('\n')}`)
        .join('\t'));
}
getAttendanceForCurrentDateSet();
