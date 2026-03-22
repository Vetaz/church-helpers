/** Put attendance in attendance record from the current date set at https://lcr.churchofjesuschrist.org/report/class-and-quorum-attendance/overview */
declare function getAttendanceForCurrentDateSet(): void;
declare function getAttendanceCsv(): string;
declare function consoleLogAttendance(): void;
export { getAttendanceForCurrentDateSet, getAttendanceCsv, consoleLogAttendance };
